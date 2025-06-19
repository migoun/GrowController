#include "relay.h"

bool humidifier_on = false;

void InitRelay()
{
    // Set the GPIO pin to output mode
    pinMode(GPIO_PIN, OUTPUT);
}

void ControlHumidifierRelay(double humidity, int min, int max)
{
    // printf("ControlHumidifierRelay - Humidity: %f, Min: %d, Max: %d, humidifier_on: %d\n", humidity, min, max, humidifier_on); 
    if (humidifier_on)
    {
        if (humidity > max)
        {
            humidifier_on = false;
            // InsertDBRelay(0);
            digitalWrite(GPIO_PIN, LOW);
        }
    }
    else
    {        
        if (humidity < min)
        {
            humidifier_on = true;
            // InsertDBRelay(1);
            digitalWrite(GPIO_PIN, HIGH);
        }
    }
}
