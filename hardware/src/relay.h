#ifndef RELAY_H
#define RELAY_H

#include <stdbool.h>
#include <wiringPi.h>
#include "db.h"

#define GPIO_PIN 21

extern void InitRelay();
extern void ControlHumidifierRelay(double humidity, int min, int max);


#endif