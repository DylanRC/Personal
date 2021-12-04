/*
CAB403 Assignment 2 - Carpark Management System
Authors:
  Dylan Chalk - n10482857
  Noah Treichel - n10533206
  René Steinkamp-Eikens - n10204032
  Adam Arena - n10801847
*/

#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <time.h>
#include <stdbool.h>
#include <string.h>
#include <pthread.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <sys/mman.h>
#include <sys/shm.h>
#include <fcntl.h>
#include <ctype.h>
#include <semaphore.h>
#include "carParkSystem.h"
#include "hashTable.h"

//Global billing variables
FILE* billing_file;
int billingTotal;
pthread_mutex_t billingMutex = PTHREAD_MUTEX_INITIALIZER;

//Global levels array
level_t* levels[noLevels];
pthread_mutex_t levelsMutex = PTHREAD_MUTEX_INITIALIZER;

//Global structs to access the shared memory
entranceM_t* entrances[noEntrances];
levelM_t* levelsG[noLevels];
exitM_t* exits[noExits];

//Global variable for plates table
HashTable platesTable;

//Global SHM variables
int fd;
char *shm;

//Global array for storing semaphores
sem_t* entranceSemaphores[noEntrances];
sem_t* boomWait[noEntrances];
sem_t* exitSemaphores[noExits];

/**
 * Creates a shared memory level struct
 * @return the level
 */
level_t* initLevel() {
    level_t *level = malloc(sizeof(level_t));
    level->size = 0;

    return level;
}

//Get the number of plates stored in the approved plates file
int numPlates(){
    FILE *fp = fopen(approvedLicenseFile, "r");
    int ch = 0;
    int lines = 0;

    if (fp == NULL){
        return 0;
    }  

    //count the lines in the file
    lines++;
    while ((ch = fgetc(fp)) != EOF)
    {
        if (ch == '\n'){
        lines++;
        }
    }

    fclose(fp);
    return lines;
}

/**
 * Read approved plates from plates.txt and save values into a hash table
 * @param table pointer to hash table
 */
void readApprovedPlates(HashTable *table) {

    FILE *pFile;
    char buffer[256];

    pFile = fopen(approvedLicenseFile, "r");
    if(pFile == NULL) {
        perror("Error opening file.");
    }
    else {
        while(fgets(buffer, sizeof(buffer), pFile)) {
            buffer[strcspn(buffer, "\n")] = 0;
            char* plate = buffer;
            ht_add(table, plate, plate);
            ht_find(table, plate);
        }
    }
    fclose(pFile);
    platesTable = *table;
}

/**
 * Check if the capacity of a level has been exceeded
 * @param levelNo level number
 * @return if the carpark level is not full, return 1
 * @return 0 
 */
int checkCapacity(int levelNo) {
    pthread_mutex_lock(&levelsMutex);   //Guarantee atomic access of global levels array

    level_t* level = levels[levelNo];

    if ((level->size) < parkCapacity) {
        pthread_mutex_unlock(&levelsMutex);
        return 1;
    }
    pthread_mutex_unlock(&levelsMutex);
    return 0;
}

/**
 * Creates a car and appends it to the level array
 * @param plate generated plate
 * @param levelNo level number
 * @param enter boolean to allow a car to enter
 */
void enterCar(char* plate, char levelNo, bool enter) {
    pthread_mutex_lock(&levelsMutex);   //Guarantee atomic access of global levels array

    car_t* car = malloc(sizeof(car_t));
    levels[levelNo]->parkedCars[levels[levelNo]->size] = car;
    strcpy(car->licensePlate, plate);
    clock_gettime(CLOCK_MONOTONIC_RAW, &car->enterTime);
    car->enter = enter;

    levels[levelNo]->size++;

    pthread_mutex_unlock(&levelsMutex);
}

/**
 * Remove a car from the level array
 * @param plate generated plate
 * @param levelNo level number
 */
void exitCar(char* plate, char levelNo) {
    pthread_mutex_lock(&levelsMutex);   //Guarantee atomic access of global levels array

    level_t *currentLevel = levels[levelNo];

    if (currentLevel->size > 0) {
        for (int i = 0; i < currentLevel->size; i++) {
            if (strcmp(currentLevel->parkedCars[i]->licensePlate, plate) == 0) {
                for (int j = i; j < currentLevel->size - 1; j++) {
                    currentLevel->parkedCars[j] = currentLevel->parkedCars[j + 1];
                }
            }
        }
    }
    currentLevel->size--;

    pthread_mutex_unlock(&levelsMutex);
}

/**
 * Find the number plate of a car within the simulator
 * @param plate generated plate
 * @return a pointer to a car with a specific number plate
 */
car_t* getCar(char* plate) {
    for (int i = 0; i < noLevels; i++) {
        for (int j = 0; j < levels[i]->size; j++) {
            if (strcmp(levels[i]->parkedCars[j]->licensePlate, plate) == 0) {
                return levels[i]->parkedCars[j];
            }
        }     
    }
}

/**
 * Check if a car exists on the level
 * @param plate generated plate
 * @return if a car with the correct number plate is found on a level, return level
 * @return 0
 */
int checkCarLevel(char* plate) {
    for (int i = 0; i < noLevels; i++) {
        for (int j = 0; j < levels[i]->size; j++) {
            if (strcmp(levels[i]->parkedCars[j]->licensePlate, plate) == 0) {
                return i;
            }
        }     
    }
    return 0;
}

/**
 * Assign level based on capacity
 * @return if there is space in the carpark, return level
 * @return -1
 */
int assignLevel() {
    for (int i = 0; i < noLevels; i++) {
        if ((levels[i]->size) < parkCapacity) {
            return i;
        }
    }
    return -1;
}

/**
 * Checks the plate against the hash table
 * @return if the plate exists in the hash table, return true
 * @return else, return false 
 */
bool checkPlate(char* plate, HashTable *table) {
    if(ht_find(table, plate) == 1){
        return true;
    }
    else{
        return false;
    }
}

/**
 * Check the number plate against the list of approved plates and assign a level
 * @return if plate does not exist, return 'X'
 * @return if the level is full, return 'F'
 * @return else return the level
 */
char LPR(char* plate) {
    if (!checkPlate(plate, &platesTable )) {
        return 'X';
    }

    pthread_mutex_lock(&levelsMutex);   //Guarantee atomic access of global levels array
    int level = assignLevel();
    pthread_mutex_unlock(&levelsMutex);

    if (level == -1) {
        return 'F';
    }

    else {
        return (char) level;
    }
}

/**
 * Calculate toll and append to file
 * @param car the car associated with the billing cost
 */
void billing(car_t *car) {
    pthread_mutex_lock(&billingMutex); //Make sure that the file and billing global variables are only written to at once

    struct timespec exitTime;
    clock_gettime(CLOCK_MONOTONIC_RAW, &exitTime);
    double totalTime = (exitTime.tv_sec - car->enterTime.tv_sec) * 1000 + (exitTime.tv_nsec - car->enterTime.tv_nsec) / 1000000;

    int due = totalTime * 5;
    int dollars = due / 100;
    int cents = due % 100; 

    //Add to the total money collected so far
    billingTotal += due;

    //Append the billing data to the file
    if (cents > 9) fprintf(billing_file, "%s $%d.%d\n", car->licensePlate, dollars, cents);

    pthread_mutex_unlock(&billingMutex); 
}

//Display the status of the system
void *statusDisplay() {
    do {
        int dollars = billingTotal / 100;
        int cents = billingTotal % 100; 

        system("clear");
        //Display all of the entrance's data
        for (int i = 0; i < noEntrances; i++) {
            printf("Entrance LPR %d: %s\n", i+1, entrances[i]->lpr.licence_plate);
            printf("Entrance Boom Gate %d: %c\n", i+1, *entrances[i]->boom_gate.status);

            if (*entrances[i]->sign.display < 10) printf("Entrance Display %d: %d\n", i+1, *entrances[i]->sign.display + 1);
            else printf("Entrance Display %d: %c\n", i+1, *entrances[i]->sign.display);
        }
        printf("\n");
        //Display all of the level's data
        for (int i = 0; i < noLevels; i++) {
            printf("Level LPR %d: %s\n", i+1, levelsG[i]->lpr.licence_plate);
            printf("Temperature Sensor %d: %d\n", i+1, *levelsG[i]->fire_system.current_temp);
            printf("Alarm %d: %d\n", i+1, *levelsG[i]->fire_system.alarm);
            printf("Level %d Capacity: %d/%d\n", i+1, levels[i]->size, parkCapacity);
        }
        printf("\n");
        for (int i = 0; i < noExits; i++) {
            printf("Exit LPR %d: %s\n", i+1, exits[i]->lpr.licence_plate);
            printf("Exit Boom Gate %d: %c\n", i+1, *exits[i]->boom_gate.status);
        }
        printf("\n");
        
        //Display total billing
        printf("-----Total Billing-----\n");
        if (cents > 9) printf("$%d.%d\n", dollars, cents);
        else printf("$%d.0%d\n", dollars, cents);

        //Sleep for 50ms
        usleep(50000);

    } while(1);
}

/**
 * Creates a shared memory entrance struct
 * @param entranceNo entrance number
 * @return the entrance
 */
entranceM_t* createEntrance(int entranceNo) {
    entranceM_t *entrance = malloc(sizeof(entranceM_t));
    int offset = 288 * entranceNo;

    entrance->lpr.mutex_lock = (pthread_mutex_t *)(shm);

    //Store pointers to the shared memory objects in struct values
    entrance->lpr.mutex_lock = (pthread_mutex_t *)(shm + 0 + offset);
    entrance->lpr.conditional = (pthread_cond_t *)(shm + 40 + offset);
    entrance->lpr.licence_plate = (char*)(shm + 88 + offset);

    entrance->boom_gate.mutex_lock = (pthread_mutex_t *)(shm + 96 + offset);
    entrance->boom_gate.conditional = (pthread_cond_t *)(shm + 136 + offset);
    entrance->boom_gate.status = (char *)(shm + 184 + offset);

    entrance->sign.mutex_lock = (pthread_mutex_t *)(shm + 192 + offset);
    entrance->sign.conditional = (pthread_cond_t *)(shm + 232 + offset);
    entrance->sign.display = (char *)(shm + 280 + offset);

    return entrance;
}

/**
 * Creates a shared memory level struct
 * @param levelNo level number
 * @return the level
 */
levelM_t* createLevel(int levelNo) {
    levelM_t *level = malloc(sizeof(levelM_t));
    int offset = 104 * levelNo;

    //Store pointers to the shared memory objects in struct values
    level->lpr.mutex_lock = (pthread_mutex_t *)(shm + 2400 + offset);
    level->lpr.conditional = (pthread_cond_t *)(shm + 2440 + offset);
    level->lpr.licence_plate = (char*)(shm + 2488 + offset);

    level->fire_system.current_temp = (int16_t *)(shm + 2496 + offset);
    level->fire_system.alarm = (char *)(shm + 2498 + offset);

    return level;
}

/**
 * Creates a shared memory exit struct
 * @param levelNo level number
 * @return the exit
 */
exitM_t* createExit(int levelNo) {
    exitM_t *exit = malloc(sizeof(exitM_t));
    int offset = 192 * levelNo;

    //Store pointers to the shared memory objects in struct values
    exit->lpr.mutex_lock = (pthread_mutex_t *)(shm + 1440 + offset);
    exit->lpr.conditional = (pthread_cond_t *)(shm + 1480 + offset);
    exit->lpr.licence_plate = (char*)(shm + 1528 + offset);

    exit->boom_gate.mutex_lock = (pthread_mutex_t *)(shm + 1536 + offset);
    exit->boom_gate.conditional = (pthread_cond_t *)(shm + 1576 + offset);
    exit->boom_gate.status = (char *)(shm + 1624 + offset);

    return exit;
}

/**
 * Helper function to create sempahores
 * @return the semaphore
 */
sem_t* createSemaphore() {
    sem_t* semaphore = malloc(sizeof(sem_t));
    sem_init(semaphore, 0, 0);
    return semaphore;
}

//Create the shared memory object and assign sections of the memory to structs
bool createAndAssign() {
    const char *key;
    key = "PARKING";

    while((fd = shm_open(key, O_RDWR, 0)) < 0) {
        usleep(10000);
    }

    //Open shared object, set its capacity, and map it to memory
    shm = mmap(0, 2920, PROT_READ | PROT_WRITE, MAP_SHARED, fd, 0);

    //Mark the shared memory to be destroyed
    shmctl(fd, IPC_RMID, 0);

    //Generate the entrances, levels and exit shared memory arrays
    for (int i = 0; i < noEntrances; i++) {
        entrances[i] = createEntrance(i);
        entranceSemaphores[i] = createSemaphore();
        boomWait[i] = createSemaphore();
    }
    for (int i = 0; i < noLevels; i++) {
        levelsG[i] = createLevel(i);
        levels[i] = initLevel(); //Also generate the parking levels
    }
    for (int i = 0; i < noExits; i++) {
        exits[i] = createExit(i);
        exitSemaphores[i] = createSemaphore();
    }

    //Set the billing variables
    int billingTotal = 0;
    billing_file = fopen(billingFile, "a+");
}

/**
 * Entrance boom gate thread function
 * @param arg entrance number
 */
void *entranceBoomgate(void *arg) {
    int entranceNo = *(int *)arg;
    entranceM_t entrance = *entrances[entranceNo];

    do {
        sem_wait(entranceSemaphores[entranceNo]);

        //Set the boom gate to raising and signal the conditional
        pthread_mutex_lock(entrance.boom_gate.mutex_lock);
        *entrance.boom_gate.status = 'R';
        pthread_cond_signal(entrance.boom_gate.conditional);
        pthread_mutex_unlock(entrance.boom_gate.mutex_lock);

        //Busy wait until the boom gate is open (the specification does not mention that the conditional is triggering on opening)
        while (*entrance.boom_gate.status != 'O') {
            usleep(1000);
        }

        //Tell the LPR that the boom gate is now open
        sem_post(boomWait[entranceNo]);
    
        //Lower the boom gate after the specified amount of time
        pthread_mutex_lock(entrance.boom_gate.mutex_lock);
        usleep((waitClose) * 1000);
        *entrance.boom_gate.status = 'L';
        pthread_cond_signal(entrance.boom_gate.conditional);
        pthread_mutex_unlock(entrance.boom_gate.mutex_lock);

    } while(1);
}

/**
 * Exit boom gate thread function
 * @param arg exit number
 */
void *exitBoomgate(void *arg) {
    int exitNo = *(int *)arg;
    exitM_t exit = *exits[exitNo];

    do {
        sem_wait(exitSemaphores[exitNo]);

        //Set the boom gate to raising and signal the conditional
        pthread_mutex_lock(exit.boom_gate.mutex_lock);
        *exit.boom_gate.status = 'R';
        pthread_cond_signal(exit.boom_gate.conditional);
        pthread_mutex_unlock(exit.boom_gate.mutex_lock);

        //Busy wait until the boom gate is open (the specification does not mention that the conditional is triggering on opening)
        while (*exit.boom_gate.status != 'O') {
            usleep(1000);
        }
    
        //Lower the boom gate after the specified amount of time
        pthread_mutex_lock(exit.boom_gate.mutex_lock);
        usleep((waitClose) * 1000);
        *exit.boom_gate.status = 'L';
        pthread_cond_signal(exit.boom_gate.conditional);
        pthread_mutex_unlock(exit.boom_gate.mutex_lock);

    } while(1);
}

/**
 * Entrance LPR threads logic
 * @param arg level number
 */
void *entranceLPR(void *arg) {
    int levelNo = *(int *)arg;
    char plate[7];
    entranceM_t entrance = *entrances[levelNo];

    pthread_mutex_lock(entrance.lpr.mutex_lock);
    do {
        //Wait to receive a number plate
        pthread_cond_wait(entrance.lpr.conditional, entrance.lpr.mutex_lock);
        strcpy(plate, entrance.lpr.licence_plate);

        //Set the display to the appropriate value and signal conditional
        char assignedLevel = LPR(&plate[0]);
        pthread_mutex_lock(entrance.sign.mutex_lock);
        *entrance.sign.display = assignedLevel;
        pthread_cond_signal(entrance.sign.conditional);
        pthread_mutex_unlock(entrance.sign.mutex_lock);

        //If the car was approved for entry check the boom gate's status and add the car to storage
        if (assignedLevel < 10) {

            //If the boom gate is open, create the car
            if (*entrance.boom_gate.status == 'O') {
                enterCar(plate, assignedLevel, true);
            }

            //If the boom gate is closed, signal the boom gate and wait to send a car through
            else {
                if (*entrance.boom_gate.status == 'L') {
                    while(1) {
                        if (*entrance.boom_gate.status == 'C') {
                            break;
                        }
                        usleep(1000);
                    }
                }

                //Tell the boom gate to open
                sem_post(entranceSemaphores[levelNo]);

                //Prevent the semaphore from being instantly reacquired
                usleep(1000);

                //Wait for the boom gate to open before entering the car
                sem_wait(boomWait[levelNo]);
                enterCar(plate, assignedLevel, true);
            }
        }
    } while (1);

    pthread_mutex_unlock(entrance.lpr.mutex_lock);
}

/**
 * Level LPR threads logic
 * @param arg level number
 */
void *levelLPR(void *arg) {
    int levelNo = *(int *)arg;
    levelM_t level = *levelsG[levelNo];

    pthread_mutex_lock(level.lpr.mutex_lock);
    do {
        //Wait for the level LPR to be triggered
        pthread_cond_wait(level.lpr.conditional, level.lpr.mutex_lock);

        car_t* car = getCar(level.lpr.licence_plate);

        //If the car is entering then check which level it was assigned, if the car is exiting do nothing
        if (car->enter == true) {
            //If the car is on its assigned level then swap the car enter status
            char assignedLevel = checkCarLevel(car->licensePlate);
            if ((int)assignedLevel == levelNo) {
                !car->enter;
            }
            
            //If the car is not on its assigned level (unusual behaviour)
            else {
                //Only add the car to the current level if it has room
                if (checkCapacity(levelNo)) {
                    exitCar(car->licensePlate, (int)assignedLevel);
                    enterCar(car->licensePlate, levelNo, false);
                }
            }
        }
    } while(1);

    pthread_mutex_unlock(level.lpr.mutex_lock);
}

/**
 * Exit LPR threads logic
 * @param arg level number
 */
void *exitLPR(void *arg) {
    int levelNo = *(int *)arg;
    exitM_t exit = *exits[levelNo];
    
    pthread_mutex_lock(exit.lpr.mutex_lock);
    do {
        //Wait to receive a number plate
        pthread_cond_wait(exit.lpr.conditional, exit.lpr.mutex_lock);
               
        //Remove the car from its assigned level and calculate billing
        car_t* car = getCar(exit.lpr.licence_plate);
        exitCar(car->licensePlate, checkCarLevel(car->licensePlate));
        billing(car);
        free(car);

        //If the boom gate is closed or lowering, signal the boom gate to open
        if (*exit.boom_gate.status != 'O') {
            if (*exit.boom_gate.status == 'L') {
                while(1) {
                    if (*exit.boom_gate.status == 'C') {
                        break;
                    }
                    usleep(1000);
                }
            }

            //Tell the exit boom gate to open
            sem_post(exitSemaphores[levelNo]);
        }

    } while (1);

    pthread_mutex_unlock(exit.lpr.mutex_lock);
}

int main() {
    //Initialise the shared memory
    createAndAssign();

    //Initialise the hash table
    int num = numPlates();
    HashTable* ht = ht_create(num);
    readApprovedPlates(ht);

    //Create the threads for the entrance LPRs and boom gates
    pthread_t *entranceThreads = malloc(sizeof(pthread_t) * noEntrances);
    pthread_t *entranceGateThreads = malloc(sizeof(pthread_t) * noEntrances);
    int entranceNos[noEntrances];
    for (int i = 0; i < noEntrances; i++) {
        entranceNos[i] = i;
        pthread_create(entranceThreads, NULL, entranceLPR, &entranceNos[i]);
        pthread_create(entranceGateThreads, NULL, entranceBoomgate, &entranceNos[i]);
    }

    //Create the threads for the level LPRs
    pthread_t *levelThreads = malloc(sizeof(pthread_t) * noLevels);
    int levelNos[noLevels];
    for (int i = 0; i < noLevels; i++) {
        levelNos[i] = i;
        pthread_create(levelThreads, NULL, levelLPR, &levelNos[i]);
    }

    //Create the threads for the exit LPRs and boom gates
    pthread_t *exitThreads = malloc(sizeof(pthread_t) * noExits);
    pthread_t *exitGateThreads = malloc(sizeof(pthread_t) * noExits);
    int exitNos[noExits];
    for (int i = 0; i < noExits; i++) {
        exitNos[i] = i;
        pthread_create(exitThreads, NULL, exitLPR, &exitNos[i]);
        pthread_create(exitGateThreads, NULL, exitBoomgate, &exitNos[i]);
    }
    
    //Create the display thread
    pthread_t displayThread;
    pthread_create(&displayThread, NULL, statusDisplay, NULL);

    //Wait for all of the threads to complete
    for (int i = 0; i < noEntrances; i++) {
        pthread_join(entranceThreads[i], NULL);
        pthread_join(entranceGateThreads[i], NULL);
    }
    for (int i = 0; i < noLevels; i++) {
        pthread_join(levelThreads[i], NULL);
    }
    for (int i = 0; i < noExits; i++) {
        pthread_join(exitThreads[i], NULL);
        pthread_join(exitGateThreads[i], NULL);
    }
    pthread_join(displayThread, NULL);
}