typedef struct simCar simCar_t;
struct simCar {
    char license_plate[7];
    struct timespec timer;
    int parkTime;
    int position;
    int assignedLevel;
    simCar_t *next;
};

void appendList(simCar_t **head, char *plate, int level);

void deleteNode(simCar_t **head, char *plate);

void deleteFirst(simCar_t **head);