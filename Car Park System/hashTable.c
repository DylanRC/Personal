#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "hashTable.h"

/**
 * Creates a new hash table
 * @param size denotes the size of the table
 * @return the table
 */
HashTable* ht_create(size_t size) {
  HashTable* table = malloc(sizeof *table);
  table->size      = size;
  table->count     = 0;
  table->items = calloc(table->size, sizeof *table->items); // NOLINT sizeof ptr
  return table;
}

/**
 * Creates a pointer to a new hash table item
 * @param key key used to hash characters
 * @param value values present in the hash table
 * @return the item
 */
HashTableItem* ht_create_item(char* key, char* value) {
  HashTableItem *item = malloc(sizeof *item);
  item->key           = strdup(key);
  item->value         = strdup(value);
  item->next          = NULL;
  return item;
}

/**
 * Frees an item
 * @param item
 */
void ht_free_item(HashTableItem* item) {
  free(item->key);
  free(item);
}

/**
 * Frees the whole hash table
 * @param table
 */
void ht_destroy(HashTable* table) {
  // Frees the table
  for (size_t i = 0; i < table->size; i++) {
    HashTableItem* item = table->items[i];
    while (item) {
      HashTableItem* next = item->next;
      ht_free_item(item);
      item = next;
    }
  }
  free(table->items);
  free(table);
}

/**
 * Creating the size of the hash table
 * @param table 
 * @param str string used to get the hash
 * @return key
 */
size_t hash_function(HashTable* table, const char* str) {
  size_t sum = 0;
  for (size_t j = 0; str[j]; ++j) sum += str[j];
  return sum % table->size;
}

/**
 * Inserts (or updates if exists) an item
 * @param table
 * @param key key used to hash characters
 * @param value values present in the hash table
 * @return
 */
void ht_add(HashTable* table, char* key, char* value) {
  HashTableItem** slot = &table->items[hash_function(table, key)];
  HashTableItem*  item = *slot;
  if (!item) table->count++;  // HashTable accounting (while will not run)
  while (item) {
    if (strcmp(item->key, key) == 0) {
      item->value = value; // exists, update value
      return;
    }
    slot = &item->next;
    item = *slot;
  }
  *slot = ht_create_item(key, value);
}

/**
 * Searches the key in the hash table
 * @param table
 * @param key key used to hash characters
 * @return NULL if it doesn't exist
 */
HashTableItem* ht_search(HashTable* table, char* key) {
  HashTableItem* item = table->items[hash_function(table, key)];

  while (item) {
    if (strcmp(item->key, key) == 0) return item;
    item = item->next;
  }
  return NULL;
}

/**
 * Finds the hash table
 * @param table
 * @param key key used to hash characters
 * @return if the key does not exist, return false
 * @return else, return true
 */
bool ht_find(HashTable* table, char* key) {
  HashTableItem* val;
  if ((val = ht_search(table, key)) == NULL) {
    return false;
  }
  else{
      return true;
  }
}