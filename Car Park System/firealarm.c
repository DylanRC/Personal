/* Fire Alarm System

This program monitors the temperature sensors declared in simulator.c and if values
exceed safe levels, will activate evacuation mode. This mode locks all boomgates open
and displays evacuation message on all signs. Multiple threads are employed to monitor
all levels at once. */

/* Useful shortcuts to work with this file:
 - Collapse all functions - ctrl + k + 0 (reccomended on first open)
 - Open all functions - ctrl + k + j
 - Comment/Uncomment highlighted - ctrl - shift - a
 */
/********************** LIBRARIES ************************/

#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <pthread.h>
#include <sys/mman.h>
#include <sys/types.h>
#include <unistd.h>
#include <fcntl.h>
#include <stdbool.h>
#include <string.h>
#include <assert.h>
#include <semaphore.h>
#include "carParkSystem.h"


/********************** CONSTANTS ************************/
#define MEDIAN_WINDOW 5
#define TEMPCHANGE_WINDOW 30
const char *key;
pthread_mutex_t mutex_lock = PTHREAD_MUTEX_INITIALIZER;
pthread_cond_t conditional = PTHREAD_COND_INITIALIZER;


/********************** VARIABLES ************************/
void *shm;
int shm_fd;
sem_t* alarm_active;

/****************** FUNCTION PROTOTYPES ******************/

    /* Takes a level number, grabs the temperature from it's sensor, creates a linked list
of averaged temperature values (to avoid data error) and activates alarm if majority 
are above the threshold*/
void *tempmonitor(void* arg);

/* Takes a value of 'C', 'O', 'R' or 'L' and changes the value of the boomgate 'status'
variable to suit*/
void *openboomgate(void *arg);

/* Function that takes a struct and an int as parameters and returns a struct named
'Templist'*/
tempnode_t *deletenodes(tempnode_t *Templist, int after);

/* Function that takes two values, casts them to integers and get's the difference between them*/
int compare(const void *first, const void *second);

// A sorting function to replace the MISRA-offending qsort
void sortingFunc(int sorttemp[MEDIAN_WINDOW]);


/****************** FUNCTION DEFINITIONS *****************/
void *openboomgate(void *arg)
{
	int levelNo = *(int *)arg;
    pthread_mutex_t* mutex_lock;
    pthread_cond_t* conditional;
    char* status;

    if (levelNo > noEntrances - 1) {
        int offset = 192 * (levelNo - noEntrances);

        mutex_lock = (pthread_mutex_t *)(shm + 1536 + offset);
        conditional = (pthread_cond_t *)(shm + 1576 + offset);
        status = (char *)(shm + 1624 + offset);
    }
    else {
        int offset = 288 * levelNo;

        mutex_lock = (pthread_mutex_t *)(shm + 96 + offset);
        conditional = (pthread_cond_t *)(shm + 136 + offset);
        status = (char *)(shm + 184 + offset);
    }


	pthread_mutex_lock(mutex_lock);
    if (*status == 'C') {
        *status = 'R';
        pthread_cond_broadcast(conditional);
    }
    else if (*status == 'L') {
		while(1) {
            if (*status == 'C') break;
        }
        *status = 'R';
        pthread_cond_broadcast(conditional);
    }
    pthread_mutex_unlock(mutex_lock);
}

tempnode_t *deletenodes(tempnode_t *Templist, int after)
{
	if (Templist->next) {
		Templist->next = deletenodes(Templist->next, after - 1);
	}
	if (after <= 0) {
		free(Templist);
		return NULL;
	}
	return Templist;
}

int compare(const void *first, const void *second)
{
	return *((const int *)first) - *((const int *)second);
}

void *tempmonitor(void* arg)
{
    int level = *(int *)arg;
	tempnode_t *templist = NULL, *newtemp, *medianlist = NULL, *oldesttemp;
	int count, addr, temp, mediantemp, hightemps;
	
	for (;;) {
		// Calculate address of temperature sensor
		addr = 104 * level + 2496;
		temp = *((int16_t *)(shm + addr));
		
		// Add temperature to beginning of linked list
		newtemp = malloc(sizeof(struct tempnode));
		newtemp->temperature = temp;
		newtemp->next = templist;
		templist = newtemp;
		
		// Delete nodes after 5th
		deletenodes(templist, MEDIAN_WINDOW);
		
		// Count nodes
		count = 0;
		for (struct tempnode *t = templist; t != NULL; t = t->next) {
			count++;
		}
		
		if (count == MEDIAN_WINDOW) { // Temperatures are only counted once we have 5 samples
			int *sorttemp = malloc(sizeof(int) * MEDIAN_WINDOW);
			count = 0;
			for (struct tempnode *t = templist; t != NULL; t = t->next) {
				sorttemp[count++] = t->temperature;
			}
			qsort(sorttemp, MEDIAN_WINDOW, sizeof(int), compare);
			mediantemp = sorttemp[(MEDIAN_WINDOW - 1) / 2];
			
			// Add median temp to linked list
			newtemp = malloc(sizeof(struct tempnode));
			newtemp->temperature = mediantemp;
			newtemp->next = medianlist;
			medianlist = newtemp;
			
			// Delete nodes after 30th
			deletenodes(medianlist, TEMPCHANGE_WINDOW);
			
			// Count nodes
			count = 0;
			hightemps = 0;
			
			for (struct tempnode *t = medianlist; t != NULL; t = t->next) {
				// Temperatures of 58 degrees and higher are a concern
				if (t->temperature >= 58) hightemps++;
				// Store the oldest temperature for rate-of-rise detection
				oldesttemp = t;
				count++;
			}
			
			if (count == TEMPCHANGE_WINDOW) {
				// If 90% of the last 30 temperatures are >= 58 degrees,
				// this is considered a high temperature. Raise the alarm
				if (hightemps >= TEMPCHANGE_WINDOW * 0.9)
					sem_post(alarm_active);
				
				// If the newest temp is >= 8 degrees higher than the oldest
				// temp (out of the last 30), this is a high rate-of-rise.
				// Raise the alarm
				if (templist->temperature - oldesttemp->temperature >= 8)
					sem_post(alarm_active);
			}
		}
		
		usleep(2000);
		
	}
}


/************************** MAIN *************************/
int main() {
    //Open shared memory with RDWR access using key
    key = "PARKING";
	shm_fd = shm_open(key, O_RDWR, 0);

    //Now attach shared segment to our data space
	shm = mmap(0, 2920, PROT_READ | PROT_WRITE, MAP_SHARED, shm_fd, 0);
    
    //Initialise the alarm semaphore
    alarm_active = malloc(sizeof(sem_t));
    sem_init(alarm_active, 0, 0);

    //Create a thread for each level
	pthread_t threads[noLevels];
    int values[noLevels];
    for (int i = 0; i < noLevels; i++) 
    {
        values[i] = i;
		pthread_create(&threads[i], NULL, tempmonitor, &values[i]);
	}
    

    //Wait for the alarm to activate
    sem_wait(alarm_active);


    // Activate alarms on all levels
    fprintf(stderr, "*** ALARM ACTIVE ***\n");
	for (int i = 0; i < noLevels; i++) {
		int addr = 104 * i + 2498;
		int8_t *alarm_trigger = (int8_t *)(shm + addr);
		*alarm_trigger = 1;
	}

	// Open up threads to all entrance boom gates
    pthread_t boomgatethreads[noEntrances + noExits];
    int entranceNos[noEntrances];
	for (int i = 0; i < noEntrances; i++) 
    {
		entranceNos[i] = i;
		pthread_create(&boomgatethreads[i], NULL, openboomgate, &entranceNos[i]);
	}

    // Open up threads to all exit boom gates
    int exitNos[noEntrances];
	for (int i = 0; i < noExits; i++) 
    {
        exitNos[i] = i + noEntrances;
		pthread_create(&boomgatethreads[i + noEntrances], NULL, openboomgate, &exitNos[i]);
	}


    // Show evacuation message on an endless loop
    pthread_mutex_t* mutex_lock;
    pthread_cond_t* conditional;
    char* display;
    int offset;
	do {
        char *evacmessage = "EVACUATE ";
	    for (char *p = evacmessage; *p != '\0'; p++) {
	    	for (int i = 0; i < noEntrances; i++) {
                offset = 288 * i;
                mutex_lock = (pthread_mutex_t *)(shm + 192 + offset);
                conditional = (pthread_cond_t *)(shm + 232 + offset);
                display = (char *)(shm + 280 + offset);

                //When the alarm is active the entranceQueues are frozen and therefore we do not have to mutex lock them
	    		*display = *p;
	    		pthread_cond_broadcast(conditional);
	    	}
	    	usleep(20000);
        }
    } while(1);
}