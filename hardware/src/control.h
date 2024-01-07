#ifndef CONTROL_H
#define CONTROL_H

#include <wiringPi.h>
#include <stdio.h>
#include <wiringShift.h>
#include <string.h>
 

#define DS 3
#define SHCP 0
#define STCP 2

extern void StartDisplay();
extern void SetText(char* text);
extern void TurnOffDisplay();

#endif