#include "control.h"

const int placePin[] = {22, 23, 24, 25};
const uint8_t digitCodeMap[] = {
  //.GFEDCBA  Segments      7-segment map:
  0b00111111, // 0   "0"          AAA
  0b00000110, // 1   "1"         F   B
  0b01011011, // 2   "2"         F   B
  0b01001111, // 3   "3"          GGG
  0b01100110, // 4   "4"         E   C
  0b01101101, // 5   "5"         E   C
  0b01111101, // 6   "6"          DDD
  0b00000111, // 7   "7"
  0b01111111, // 8   "8"
  0b01101111, // 9   "9"
  0b01100011, // (10) '*'  Degree
  0b10000000, // (11) '.' DOT
  0b01110110, // (12) H (Humidity)
  0b00000000  // (13) Blank
};

void pickDigit(int digit)
{
    for (int i = 0; i < 4; i++)
    {
        digitalWrite(placePin[i], i == digit);
    }
}

void hc595_shift(int8_t data)
{
    int i;
    data = ~data;

    for (i = 0; i < 8; i++)
    {
        digitalWrite(DS, 0x80 & (data << i));
        digitalWrite(SHCP, 1);
        delayMicroseconds(1);
        digitalWrite(SHCP, 0);
    }
    digitalWrite(STCP, 1);
    delayMicroseconds(1);
    digitalWrite(STCP, 0);
}

void clearDisplay()
{
    int i;
    for (i = 0; i < 8; i++)
    {
        digitalWrite(DS, 1);
        digitalWrite(SHCP, 1);
        delayMicroseconds(1);
        digitalWrite(SHCP, 0);
    }
    digitalWrite(STCP, 1);
    delayMicroseconds(1);
    digitalWrite(STCP, 0);
}

void TurnOffDisplay()
{
    for (int i=0; i<4; i++)
    {
        pickDigit(i);
        clearDisplay();
    }
}

void SetText(char* text)
{
    uint8_t data[4];

    int d = 0;
    for (int i=0; i<(int)strlen(text); i++)
    {             
        if (text[i] >= '0' && text[i] <= '9')
        {
            data[d] = digitCodeMap[text[i] - 48];
        }
        else if (text[i] == '*')
        {
            data[d] = digitCodeMap[10];
        }
        else if (text[i] == '.')
        {
            d--;
            data[d] = data[d] | digitCodeMap[11];
        }
        else if (text[i] == 'H')
        {
            data[d] = digitCodeMap[12];
        }
        else if (text[i] == ' ')
        {
            data[i] = digitCodeMap[13];
        }        
        d++;
    }

    for (int i=0; i<4; i++)
    {
        clearDisplay();
        pickDigit(i);
        hc595_shift(data[i]);
    }

}

void StartDisplay()
{
    if (wiringPiSetup() == -1)
    { 
        printf("setup wiringPi failed !");
        return;
    }

    pinMode(DS, OUTPUT); 
    pinMode(STCP, OUTPUT);
    pinMode(SHCP, OUTPUT);
    
    for (int i = 0; i < 4; i++)
    {
        pinMode(placePin[i], OUTPUT);
        digitalWrite(placePin[i], HIGH);
    }
}
