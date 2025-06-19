#ifndef DB_H
#define DB_H

#include <stdio.h>
#include <sqlite3.h>
#include <syslog.h>

extern int InitDB();
extern void CloseDB();
extern int InsertDBMeasurement(float temperature, float humidity);
extern int GetGBSetting(char* setting_name);
extern void UpdateGBSetting(char* setting_name, int new_value);
extern int InsertDBRelay(int active);

#endif