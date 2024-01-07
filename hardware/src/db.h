#ifndef DB_H
#define DB_H

#include <stdio.h>
#include <sqlite3.h>

extern int InitDB();
extern void CloseDB();
extern char* InsertDB(float temperature, float humidity);

#endif