#ifndef SHT31_H
#define SHT31_H

#include <stdlib.h>
#include <stdio.h>
#include <syslog.h>
// Libraries needed for I2C port
#include <linux/i2c-dev.h> 
#include <sys/ioctl.h> 
#include <fcntl.h> 
#include <unistd.h>

struct SensorData {
    double temperature;
    double humidity;
};

extern void InitSHT();
extern struct SensorData GetSHTData();

#endif