// key => value plus pointer to next item for hash collisions
typedef struct HashTableItem HashTableItem;
struct HashTableItem {
  char*       key;
  char*     value;
  HashTableItem* next;
};

// Contains an array of pointers to HashTableItems
typedef struct HashTable {
  HashTableItem** items;
  size_t          size;
  size_t          count; // could be used for rehashing in future
} HashTable;


//
HashTable* ht_create(size_t size);

//
HashTableItem* ht_create_item(char* key, char* value);


//
void ht_free_item(HashTableItem* item);

//
void ht_destroy(HashTable* table);

//
size_t hash_function(HashTable* table, const char* str);

//
void ht_add(HashTable* table, char* key, char* value);

//
HashTableItem* ht_search(HashTable* table, char* key);

//
bool ht_find(HashTable* table, char* key);