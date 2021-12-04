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
#include <unistd.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <sys/mman.h>
#include <sys/shm.h>
#include <fcntl.h>
#include <semaphore.h>
#include <ctype.h>
#include "carParkSystem.h"
#include "linkedList.h"

//Global variables for shared memory
entranceM_t* entrances[noEntrances];
levelM_t* levelsG[noLevels];
exitM_t* exits[noExits];

//Global arrays for the start of each entrance and exit queue
simCar_t* entranceQueues[noEntrances];
simCar_t* exitQueues[noExits];

//Global arrays for semaphores
sem_t* entranceSemaphores[noEntrances];
sem_t* exitSemaphores[noExits];

//Global variable for start of cars linked list
simCar_t* carsList;
pthread_mutex_t carsListLock = PTHREAD_MUTEX_INITIALIZER;

/**
 * Creates a shared memory entrance struct
 * @param shm pointer to the shared memory
 * @param entranceNo entrance number
 * @param mutex_attr attribute used to set the mutex values to shared
 * @param cond_attr attribute used to set the conditional values to shared
 * @return the entrance
 */
entranceM_t* createEntrance(char *shm, int entranceNo, pthread_mutexattr_t *mutex_attr, pthread_condattr_t *cond_attr) {
    entranceM_t *entrance = malloc(sizeof(entranceM_t));
    int offset = 288 * entranceNo;

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

    //Initalise the mutexes and conditionals
    pthread_mutex_init(entrance->lpr.mutex_lock, mutex_attr);
    pthread_mutex_init(entrance->boom_gate.mutex_lock, mutex_attr);
    pthread_mutex_init(entrance->sign.mutex_lock, mutex_attr);

    pthread_cond_init(entrance->lpr.conditional, cond_attr);
    pthread_cond_init(entrance->boom_gate.conditional, cond_attr);
    pthread_cond_init(entrance->sign.conditional, cond_attr);

    //Initialise boom gate as closed, the LPR as all zeros and the sign as F
    *entrance->boom_gate.status = 'C';
    strcpy(entrance->lpr.licence_plate, "000000");
    *entrance->sign.display = 'F';

    return entrance;
}

/**
 * Creates a shared memory level struct
 * @param shm pointer to the shared memory
 * @param entranceNo entrance number
 * @param mutex_attr attribute used to set the mutex values to shared
 * @param cond_attr attribute used to set the conditional values to shared
 * @return the level
 */
levelM_t* createLevel(char *shm, int levelNo, pthread_mutexattr_t *mutex_attr, pthread_condattr_t *cond_attr) {
    levelM_t *level = malloc(sizeof(levelM_t));
    int offset = 104 * levelNo;

    //Store pointers to the shared memory objects in struct values
    level->lpr.mutex_lock = (pthread_mutex_t *)(shm + 2400 + offset);
    level->lpr.conditional = (pthread_cond_t *)(shm + 2440 + offset);
    level->lpr.licence_plate = (char*)(shm + 2488 + offset);

    level->fire_system.current_temp = (int16_t *)(shm + 2496 + offset);
    level->fire_system.alarm = (int8_t *)(shm + 2498 + offset);

    //Initialise the mutexes and conditionals
    pthread_mutex_init(level->lpr.mutex_lock, mutex_attr);
    pthread_cond_init(level->lpr.conditional, cond_attr);

    strcpy(level->lpr.licence_plate, "000000");
    *level->fire_system.current_temp = 23;
    *level->fire_system.alarm = 0;

    return level;
}

/**
 * Creates a shared memory exit struct
 * @param shm pointer to the shared memory
 * @param entranceNo entrance number
 * @param mutex_attr attribute used to set the mutex values to shared
 * @param cond_attr attribute used to set the conditional values to shared
 * @return the exit
 */
exitM_t* createExit(char *shm, int levelNo, pthread_mutexattr_t *mutex_attr, pthread_condattr_t *cond_attr) {
    exitM_t *exit = malloc(sizeof(exitM_t));
    int offset = 192 * levelNo;

    //Store pointers to the shared memory objects in struct values
    exit->lpr.mutex_lock = (pthread_mutex_t *)(shm + 1440 + offset);
    exit->lpr.conditional = (pthread_cond_t *)(shm + 1480 + offset);
    exit->lpr.licence_plate = (char*)(shm + 1528 + offset);

    exit->boom_gate.mutex_lock = (pthread_mutex_t *)(shm + 1536 + offset);
    exit->boom_gate.conditional = (pthread_cond_t *)(shm + 1576 + offset);
    exit->boom_gate.status = (char *)(shm + 1624 + offset);

    //Initalise mutexes and conditionals
    pthread_mutex_init(exit->lpr.mutex_lock, mutex_attr);
    pthread_mutex_init(exit->boom_gate.mutex_lock, mutex_attr);
    
    pthread_cond_init(exit->lpr.conditional, cond_attr);
    pthread_cond_init(exit->boom_gate.conditional, cond_attr);

    //Initialise boom gate as closed and the LPR as all zeros
    *exit->boom_gate.status = 'C';
    strcpy(exit->lpr.licence_plate, "000000");

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
    int fd;
    char *shm;
    const char *key;
    pthread_mutexattr_t mutex_attr;
    pthread_condattr_t cond_attr;

    //Open shared object, set its capacity and map it to memory
    key = "PARKING";
    fd = shm_open(key, O_RDWR | O_CREAT | O_TRUNC, 0666);
    ftruncate(fd, 2920);
    shm = mmap(0, 2920, PROT_READ | PROT_WRITE, MAP_SHARED, fd, 0);

    //Mark the shared memory to be destroyed
    shmctl(fd, IPC_RMID, 0);
    
    //Initalise mutex, conditional attributes
    pthread_mutexattr_init(&mutex_attr);

    pthread_mutexattr_setpshared(&mutex_attr, PTHREAD_PROCESS_SHARED);
    pthread_condattr_init(&cond_attr);
    pthread_condattr_setpshared(&cond_attr, PTHREAD_PROCESS_SHARED);

    //Generate the entrances, levels and exit shared memory arrays
    for (int i = 0; i < noEntrances; i++) {
        entrances[i] = createEntrance(shm, i, &mutex_attr, &cond_attr);
        entranceSemaphores[i] = createSemaphore();
    }

    for (int i = 0; i < noLevels; i++) {
        levelsG[i] = createLevel(shm, i, &mutex_attr, &cond_attr);
    }

    for (int i = 0; i < noExits; i++) {
        exits[i] = createExit(shm, i, &mutex_attr, &cond_attr);
        exitSemaphores[i] = createSemaphore();
    }
}

//Thread function to generate license plates and add them to the queue
void *plateGenerator() {
    char* parameter;
    char plate[7];
    int lines = 1;
    int currentLine = 0;
    int ch;

    //Open the file and error if it cannot be
    FILE *fp = fopen(approvedLicenseFile, "r");
    if (fp == NULL){
        perror("Cannot open plates file");
        exit(1);
    }

    //Count the number of lines in the file
    while ((ch = fgetc(fp)) != EOF)
    {
        if (ch == '\n'){
        lines++;
        }
    }

    //Cache the plates in an array for faster access
    char cachedPlates[lines][7];
    rewind(fp);

    for (int i = 0; i < lines; i++) {
        fgets(plate, 8, fp);
        plate[strcspn(plate, "\n")] = 0;
        plate[7] = '\0';
        strcpy(cachedPlates[i], plate);
    }

    do {
        //If any alarm is active shut down the plate generator
        if (*levelsG[0]->fire_system.alarm == 1) return NULL;

        //Generate a random number between carGenerationTimeL carGenerationTimeU
        int waitTime = (rand() % (carGenerationTimeU - carGenerationTimeL)) + carGenerationTimeL;
        usleep(waitTime * 1000);

        int randEntrance = rand() % noEntrances;

        //Generate a an approved plate or a random plate
        if((rand() % 2) == 1) {
            strcpy(plate, cachedPlates[currentLine % lines]);
            currentLine++;
        }
        else {
            for (int i = 0; i < 3; i++) {
                char nRandonNumber = "0123456789"[rand() % 10];
                plate[i] = nRandonNumber;
                char nRandonChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[rand() % 26];
                plate[i + 3] = nRandonChars;
            }
        }

        //Assign the car to the back of a random extrance queue (between 1 and noEntrances)
        appendList(&entranceQueues[randEntrance], plate, 0); 
    } while(1);
}

/**
 * Entrance boom gate thread function
 * @param arg level number
 */
void *entranceBoomgate(void *arg) {
    int levelNo = *(int *)arg;
    entranceM_t entrance = *entrances[levelNo];

    pthread_mutex_lock(entrance.boom_gate.mutex_lock);
    do {
        //Wait for the manager to set the boom gate to raising
        pthread_cond_wait(entrance.boom_gate.conditional, entrance.boom_gate.mutex_lock);
        usleep(gateOpen * 1000);
        *entrance.boom_gate.status = 'O';

        //Signal that the boom gate is open
        sem_post(entranceSemaphores[levelNo]);

        //Wait for the manager to set the boom gate to lowering
        pthread_cond_wait(entrance.boom_gate.conditional, entrance.boom_gate.mutex_lock);

        //Set the boom gate to closed after the alloted time
        usleep(gateClose * 1000);
        *entrance.boom_gate.status = 'C';
    } while(1);
    pthread_mutex_unlock(entrance.boom_gate.mutex_lock);
}

/**
 * Exit boom gate thread function
 * @param arg level number
 */
void *exitBoomgate(void *arg) {
    int levelNo = *(int *)arg;
    exitM_t exit = *exits[levelNo];

    pthread_mutex_lock(exit.boom_gate.mutex_lock);
    do {
        //Wait for the manager to set the boom gate to raising
        pthread_cond_wait(exit.boom_gate.conditional, exit.boom_gate.mutex_lock);
        usleep(gateOpen * 1000);
        *exit.boom_gate.status = 'O';

        //Signal that the boom gate is open
        sem_post(exitSemaphores[levelNo]);

        //Wait for the manager to set the boom gate to lowering
        pthread_cond_wait(exit.boom_gate.conditional, exit.boom_gate.mutex_lock);

        //Set the boom gate to closed after the alloted time
        usleep(gateClose * 1000);
        *exit.boom_gate.status = 'C';

    } while(1);
    pthread_mutex_unlock(exit.boom_gate.mutex_lock);
}

/**
 * Entrance queue thread function
 * @param arg queue number
 */
void *entranceQueue(void *arg) {
    int queueNo = *(int *)arg;

    pthread_mutex_lock(entrances[queueNo]->sign.mutex_lock);
    do {
        //If the alarm is active cancel entering and unlock the sign
        if (*levelsG[queueNo]->fire_system.alarm == 1) {
            pthread_mutex_unlock(entrances[queueNo]->sign.mutex_lock);
            return NULL;
        }
        
        //If there is currently no cars queued, wait until there are
        while (entranceQueues[queueNo] == NULL) {
            usleep(1000);
        }

        pthread_mutex_lock(entrances[queueNo]->lpr.mutex_lock);

        //Wait 2ms and then trigger the LPR 
        usleep(queueTime * 1000);
        strcpy(entrances[queueNo]->lpr.licence_plate, entranceQueues[queueNo]->license_plate);

        pthread_cond_signal(entrances[queueNo]->lpr.conditional);
        pthread_mutex_unlock(entrances[queueNo]->lpr.mutex_lock);

        //Wait for the sign to return a value
        pthread_cond_wait(entrances[queueNo]->sign.conditional, entrances[queueNo]->sign.mutex_lock);
        char assignedLevel = *entrances[queueNo]->sign.display;

        if (assignedLevel < 10) {
            if (*entrances[queueNo]->boom_gate.status == 'O') {
                appendList(&carsList, entranceQueues[queueNo]->license_plate, (int) assignedLevel);
            }
            else {
                if (*entrances[queueNo]->boom_gate.status == 'L') {
                    //Wait for the boom gate to close
                    while(1) {
                        if (*entrances[queueNo]->boom_gate.status == 'C') {
                            break;
                        }
                        usleep(1000);
                    }
                }

                //Wait for the boom gate to open
                sem_wait(entranceSemaphores[queueNo]);

                //Make sure that carsList is only appended to atomically
                pthread_mutex_lock(&carsListLock);
                appendList(&carsList, entranceQueues[queueNo]->license_plate, (int) assignedLevel);
                pthread_mutex_unlock(&carsListLock);

            }
        }
        
        deleteFirst(&entranceQueues[queueNo]);

    } while (1);

    pthread_mutex_unlock(entrances[queueNo]->sign.mutex_lock);
}

/**
 * Exit queue thread function
 * @param arg queue number
 */
void *exitQueue(void *arg) {
    int queueNo = *(int *)arg;

    do {
        //If there is currently no cars queued, wait until there are
        while (exitQueues[queueNo] == NULL) {
            usleep(1000);
        }

        //Trigger the LPR 
        pthread_mutex_lock(exits[queueNo]->lpr.mutex_lock);
        strcpy(exits[queueNo]->lpr.licence_plate, exitQueues[queueNo]->license_plate);
        pthread_cond_signal(exits[queueNo]->lpr.conditional);
        pthread_mutex_unlock(exits[queueNo]->lpr.mutex_lock);

        if (*exits[queueNo]->boom_gate.status != 'O') {
            if (*exits[queueNo]->boom_gate.status == 'L') {
                //Wait for the boom gate to close
                while(1) {
                    if (*exits[queueNo]->boom_gate.status == 'C') {
                        break;
                    }
                    usleep(1000);
                }
            }

            //Wait for the boom gate to open
            sem_wait(exitSemaphores[queueNo]);
        }
        
        deleteFirst(&exitQueues[queueNo]);

    } while (1);
}

//Simulate the temperatures
void *tempSimulator() {
    do {
        //Generate a temperature for each level and store these in previous temps
        for (int i = 0; i < noLevels; i++) {;
            *levelsG[i]->fire_system.current_temp = (int16_t) (rand() % 64);
        }

        //Sleep between temperatureChangeU and temperatureChangeL
        int waitTime = (rand() % (temperatureChangeU - temperatureChangeL)) + temperatureChangeL;
        usleep(waitTime * 1000);
    } while (1);
}

//Simulates the interactions a car will process as it traverses through the carpark
void simulateCar() {
    simCar_t* car = carsList;
    simCar_t* previousCar;
    struct timespec time;
    bool removeCar = false;
    double totalTime;
    int randExit;

    do {
        if (car != NULL) {
            switch(car->position) {

                //Drive to the level LPR and set park time
                case 0:
                    if (*levelsG[0]->fire_system.alarm == 1) car->position = 4;

                    clock_gettime(CLOCK_MONOTONIC_RAW, &time);
                    totalTime = (time.tv_sec - car->timer.tv_sec) * 1000 + (time.tv_nsec - car->timer.tv_nsec) / 1000000;
                    if(totalTime >= driveTime){
                        car->parkTime = (rand() % (parkedTimeU - parkedTimeL)) + parkedTimeL;
                        clock_gettime(CLOCK_MONOTONIC_RAW, &car->timer);
                        car->position = car->position + 1; 
                    }
                    break;

                //Trigger the level LPR
                case 1:
                    pthread_mutex_lock(levelsG[car->assignedLevel]->lpr.mutex_lock);
                    strcpy(levelsG[car->assignedLevel]->lpr.licence_plate, car->license_plate);
                    pthread_cond_signal(levelsG[car->assignedLevel]->lpr.conditional);
                    pthread_mutex_unlock(levelsG[car->assignedLevel]->lpr.mutex_lock);
                    
                    car->position = car->position + 1; 
                    break;

                //Park for the allocated time
                case 2:
                    if (*levelsG[0]->fire_system.alarm == 1) car->position++;

                    clock_gettime(CLOCK_MONOTONIC_RAW, &time);
                    totalTime = (time.tv_sec - car->timer.tv_sec) * 1000 + (time.tv_nsec - car->timer.tv_nsec) / 1000000;

                    //If the alloted time has passed
                    if(totalTime >= car->parkTime){
                        //Trigger the level LPR
                        pthread_mutex_lock(levelsG[car->assignedLevel]->lpr.mutex_lock);
                        strcpy(levelsG[car->assignedLevel]->lpr.licence_plate, car->license_plate);
                        pthread_mutex_unlock(levelsG[car->assignedLevel]->lpr.mutex_lock);
                        pthread_cond_signal(levelsG[car->assignedLevel]->lpr.conditional);
                        clock_gettime(CLOCK_MONOTONIC_RAW, &car->timer);
                        car->position = car->position + 1; 
                    }
                    break;
                
                //Trigger the level LPR again on exit
                case 3:
                    pthread_mutex_lock(levelsG[car->assignedLevel]->lpr.mutex_lock);
                    strcpy(levelsG[car->assignedLevel]->lpr.licence_plate, car->license_plate);
                    pthread_cond_signal(levelsG[car->assignedLevel]->lpr.conditional);
                    pthread_mutex_unlock(levelsG[car->assignedLevel]->lpr.mutex_lock);
                    
                    car->position = car->position + 1;
                    break;

                //Drive to a random exit                   
                case 4:
                    clock_gettime(CLOCK_MONOTONIC_RAW, &time);
                    totalTime = (time.tv_sec - car->timer.tv_sec) * 1000 + (time.tv_nsec - car->timer.tv_nsec) / 1000000;
                    if(totalTime >= driveTime){
                        car->position = car->position + 1; 
                    }

                    break;

                //Append the car to the exit queue and remove it from carsList
                case 5:
                    randExit = rand() % noExits;
                    appendList(&exitQueues[randExit], car->license_plate, 0);
                    car->position = car->position + 1;

                    //deleteNode(&previousCar, &car);
                    removeCar = true;
                    break;
            }

            if (!removeCar) previousCar = car;
            car = car->next;
        }
        
        removeCar = false;

        if (car == NULL) car = carsList;

        //Wait a millisecond to reduce CPU usage
        usleep(1000);
    } while(1);
}

int main() {
    //Seed the random number generator
    srand(time(NULL));

    //Create shared memory and assign pointers to arrays of structs
    createAndAssign();

    //Sleep to allow the manager to start up
    sleep(3);
    
    //Create a thread for plate generation
    pthread_t plateGeneratorThread;
    pthread_create(&plateGeneratorThread, NULL, plateGenerator, NULL);

    //Create a thread for temperature simulation
    pthread_t tempSimulatorThread;
    pthread_create(&tempSimulatorThread, NULL, tempSimulator, NULL);

    //Create a queue thread and boom gate thread for each entrance
    pthread_t *entranceThreads = malloc(sizeof(pthread_t) * noEntrances);
    pthread_t *entranceGateThreads = malloc(sizeof(pthread_t) * noEntrances);
    int entranceNos[noEntrances];
    for(int i = 0; i < noEntrances; i++) {
        entranceNos[i] = i;
        pthread_create(entranceThreads, NULL, entranceQueue, &entranceNos[i]);
        pthread_create(entranceGateThreads, NULL, entranceBoomgate, &entranceNos[i]);
    }

    //Create a queue thread and boom gate thread for each exit
    pthread_t *exitThreads = malloc(sizeof(pthread_t) * noExits);
    pthread_t *exitGateThreads = malloc(sizeof(pthread_t) * noExits);
    int exitNos[noExits];
    for(int i = 0; i < noExits; i++) {
        exitNos[i] = i;
        pthread_create(exitThreads, NULL, exitQueue, &exitNos[i]);
        pthread_create(exitGateThreads, NULL, exitBoomgate, &exitNos[i]);
    }

    //Start running the car simulator
    simulateCar();

    //Wait for all of the threads to complete
    pthread_join(plateGeneratorThread, NULL);
    pthread_join(tempSimulatorThread, NULL);
    for (int i = 0; i < noEntrances; i++) {
        pthread_join(entranceThreads[i], NULL);
        pthread_join(entranceGateThreads[i], NULL);
    }
    for (int i = 0; i < noExits; i++) {
        pthread_join(exitThreads[i], NULL);
        pthread_join(exitGateThreads[i], NULL);
    }
}