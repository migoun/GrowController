#include "db.h"

sqlite3 *db;

// initialize db
int InitDB()
{
    int rc = sqlite3_open("../growportal/growcontrol.db", &db);

    if (rc != SQLITE_OK) {
        printf("Cannot open database: %s\n", sqlite3_errmsg(db));
        return 1;
    }

    // Create a table if it doesn't exist
    const char *createTableSQL = "CREATE TABLE IF NOT EXISTS measurement_history (\
        id INTEGER PRIMARY KEY,\
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,\
        temperature REAL,\
        humidity INTEGER\
    );";
    
    rc = sqlite3_exec(db, createTableSQL, 0, 0, 0);

    if (rc != SQLITE_OK) {
        printf("Cannot create table: %s\n", sqlite3_errmsg(db));
        sqlite3_close(db);
        return 1;
    }

    if (rc != SQLITE_OK) {
        printf("Cannot create table: %s\n", sqlite3_errmsg(db));
        sqlite3_close(db);
        return 1;
    }

    return 0;
}

char* InsertDB(float temperature, float humidity)
{
    // Insert data
    char insertDataSQL[100];
    snprintf(insertDataSQL, sizeof(insertDataSQL), "INSERT INTO measurement_history (temperature, humidity)\
        VALUES (%f, %f);", temperature, humidity);

    int rc = sqlite3_exec(db, insertDataSQL, 0, 0, 0);

    if (rc != SQLITE_OK) {
        printf("Cannot insert data: %s\n", sqlite3_errmsg(db));
        CloseDB();
        return (char*)sqlite3_errmsg(db);
    }

    return "ok";
}

void CloseDB()
{
    sqlite3_close(db);
}