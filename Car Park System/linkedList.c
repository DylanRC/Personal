#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include "linkedList.h"

/**
 * Appends the linked list
 * @param head first node in the linked list
 * @param plate generated plate
 */
void appendList(simCar_t **head, char *plate, int level)
{
    simCar_t *newNode = malloc(sizeof(simCar_t));
    strcpy(newNode->license_plate, plate);
    clock_gettime(CLOCK_MONOTONIC_RAW, &newNode->timer);
    newNode->position = 0;
    newNode->assignedLevel = level;
    newNode->next = NULL;

    if(*head == NULL)
        { *head = newNode;}
    else
    {
        simCar_t *lastNode = *head;

        while(lastNode->next != NULL)
        {
            lastNode = lastNode->next;
        }

        lastNode->next = newNode;
    }
}

/**
 * Function used to delete a car from the simulator
 * @param head first node in the linked list
 * @param plate generated plate
 */
void deleteNode(simCar_t** head, char *plate)
{
    simCar_t *temp = *head, *prev;
 
    if (temp != NULL && (strcmp(plate, temp->license_plate) == 0)) {
        *head = temp->next;
        free(temp); 
        return;
    }

    while (temp != NULL && (strcmp(plate, temp->license_plate) == 0)) {
        prev = temp;
        temp = temp->next;
    }
 
    if (temp == NULL){
        return;
    }
 
    prev->next = temp->next; 
    free(temp);
}

/**
 * Function used to delete the header, and the reapply the head to the next node
 * @param head first node in the linked list
 * @return if head is null, return
 */
void deleteFirst(simCar_t **head) {
    simCar_t* temp;
    if (*head == NULL)
    {
        return;
    }
    // Move the head pointer to the next node
    temp = *head;
    *head = (*head)->next;
 
    free(temp);
}