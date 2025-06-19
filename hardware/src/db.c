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
    const char *measurement_table = "CREATE TABLE IF NOT EXISTS measurement_history (\
        id INTEGER PRIMARY KEY,\
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,\
        temperature REAL,\
        humidity REAL\
    );";

    rc = sqlite3_exec(db, measurement_table, 0, 0, 0);

    if (rc != SQLITE_OK) {
        printf("Cannot create measurement_history: %s\n", sqlite3_errmsg(db));
        sqlite3_close(db);
        return 1;
    }

    // Relay History table
    const char *relay_table = "CREATE TABLE IF NOT EXISTS relay_history (\
        id INTEGER PRIMARY KEY,\
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,\
        active INTEGER\
    );";

    rc = sqlite3_exec(db, relay_table, 0, 0, 0);

    if (rc != SQLITE_OK) {
        printf("Cannot create relay_history: %s\n", sqlite3_errmsg(db));
        sqlite3_close(db);
        return 1;
    }

    // Relay History table
    const char *settings_table = "CREATE TABLE IF NOT EXISTS settings (\
        setting_name TEXT PRIMARY KEY, \
        setting_value INTEGER \
    );";

    rc = sqlite3_exec(db, settings_table, 0, 0, 0);

    if (rc != SQLITE_OK) {
        printf("Cannot create settings table: %s\n", sqlite3_errmsg(db));
        sqlite3_close(db);
        return 1;
    }

    sqlite3_exec(db, "INSERT OR IGNORE INTO settings (setting_name, setting_value) VALUES ('relay_min', 60);", 0, 0, 0);
    sqlite3_exec(db, "INSERT OR IGNORE INTO settings (setting_name, setting_value) VALUES ('relay_max', 63);", 0, 0, 0);

    return 0;
}

int InsertDBMeasurement(float temperature, float humidity)
{
    // Insert data
    char insertDataSQL[256];
    snprintf(insertDataSQL, sizeof(insertDataSQL), "INSERT INTO measurement_history (timestamp, temperature, humidity)\
        VALUES (datetime('now', 'localtime'), %f, %f);", temperature, humidity);

    int rc = sqlite3_exec(db, insertDataSQL, 0, 0, 0);

    if (rc != SQLITE_OK) {
        printf("Cannot insert data: %s\n", sqlite3_errmsg(db));
        syslog(LOG_ERR, (char*)sqlite3_errmsg(db));
        return 1;
    }

    return 0;
}

int InsertDBRelay(int active)
{
    // Insert data
    char insertDataSQL[256];
    snprintf(insertDataSQL, sizeof(insertDataSQL), "INSERT INTO relay_history (active)\
        VALUES (%d);", active);

    int rc = sqlite3_exec(db, insertDataSQL, 0, 0, 0);

    if (rc != SQLITE_OK) {
        printf("Cannot insert data: %s\n", sqlite3_errmsg(db));
        syslog(LOG_ERR, (char*)sqlite3_errmsg(db));
        return 1;
    }

    return 0;
}

int GetGBSetting(char* setting_name)
{
    sqlite3_stmt *stmt;
    char *sql = sqlite3_mprintf("SELECT setting_value FROM settings WHERE setting_name = '%q'", setting_name);
    int rc = sqlite3_prepare_v2(db, sql, -1, &stmt, NULL);
     if (rc != SQLITE_OK) {
        fprintf(stderr, "Failed to prepare statement: %s\n", sqlite3_errmsg(db));
        sqlite3_free(sql);
        return 0;
    }

    // Execute the statement and retrieve the setting value
    int result = 0;
    rc = sqlite3_step(stmt);
    if (rc == SQLITE_ROW) {
        int value = sqlite3_column_int(stmt, 0);
        // Use the integer value directly
        result = value;
    } else if (rc == SQLITE_DONE) {
        fprintf(stderr, "Setting not found: %s\n", setting_name);
    } else {
        fprintf(stderr, "Failed to retrieve setting: %s\n", sqlite3_errmsg(db));
    }

    sqlite3_free(sql); // Free the allocated memory    
    sqlite3_finalize(stmt);

    return result;
}

void UpdateGBSetting(char* setting_name, int new_value) 
{
    char *err_msg = 0;
    int rc;

    // Create the SQL statement
    char *sql = sqlite3_mprintf("UPDATE settings SET setting_value = %d WHERE setting_name = '%q'", new_value, setting_name);
    
    // Execute the SQL statement
    rc = sqlite3_exec(db, sql, 0, 0, &err_msg);
    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", err_msg);
        sqlite3_free(err_msg);
        sqlite3_free(sql);
        return;
    }

    // Free the allocated memory for SQL statement
    sqlite3_free(sql);
}

void CloseDB()
{
    sqlite3_close(db);
}