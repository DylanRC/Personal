#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>

//Define constants
#define noEntrances 5
#define noLevels 5
#define noExits 5
#define parkCapacity 20
#define approvedLicenseFile "plates.txt"
#define billingFile "billing.txt"

//Define times
#define multiplier 1
#define carGenerationTimeL 1 * multiplier
#define carGenerationTimeU 100 * multiplier
#define gateOpen 10 * multiplier
#define gateClose 10 * multiplier
#define waitClose 20 * multiplier
#define driveTime 10 * multiplier
#define queueTime 2 * multiplier
#define parkedTimeL 100 * multiplier
#define parkedTimeU 10000 * multiplier
#define temperatureChangeL 1 * multiplier
#define temperatureChangeU 5 * multiplier

//Associate a license plate with enter time and enter status
typedef struct car {
    char licensePlate[7];
    struct timespec enterTime;
    bool enter;
} car_t;


//A pointer array of parked cars with its size
typedef struct level {
    int size;
    car_t* parkedCars[parkCapacity];
} level_t;

typedef struct lpr
{
    pthread_mutex_t *mutex_lock;
    pthread_cond_t *conditional;
    char* licence_plate;
} lpr_t;


typedef struct boom_gate
{
    pthread_mutex_t *mutex_lock;
    pthread_cond_t *conditional;
    char *status;
} boom_gate_t;


typedef struct sign
{
    pthread_mutex_t *mutex_lock;
    pthread_cond_t *conditional;
    char *display; 
} sign_t;

typedef struct fire_system
{   
    volatile int16_t *current_temp;
    int8_t *alarm;
} fire_system_t;


typedef struct entranceM
{
    lpr_t lpr;
    boom_gate_t boom_gate;
    sign_t sign;
} entranceM_t;


typedef struct levelM
{
    lpr_t lpr;
    fire_system_t fire_system;

} levelM_t;


typedef struct exitM
{
    lpr_t lpr;
    boom_gate_t boom_gate;  
} exitM_t;


typedef struct tempnode 
{
	int temperature;
	struct tempnode *next;
}tempnode_t;