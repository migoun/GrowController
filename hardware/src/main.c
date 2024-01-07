#include <stdio.h>
#include <stdbool.h>
#include <signal.h>
#include <stdlib.h>
#include <syslog.h>
#include <unistd.h>
#include "control.h"
// #include "dht.h"
#include "sht31.h"
#include "db.h"

// interval of sensor measurement
#define MEASURE_INTERVAL 5
// how much MEASURE_INTERVALs pass until
#define DB_WRITE_INTERVAL 6

char displayText[10];
bool humidityMode = false;
int measure_counter = 0;

// Global variable to check if the program should terminate
volatile sig_atomic_t terminate = 0;

// Signal handler for SIGTERM
void handleSigTerm(int signo) {
    syslog(LOG_INFO, "Received signal %d. Exiting...", signo);
    
    // Set the terminate flag to indicate that the program should exit
    terminate = 1;
}

void timer(int timer1)
{ 
    if (timer1 == SIGALRM)
    {         
        // Read from sensor
        TurnOffDisplay();
        struct SensorData data = GetSHTData();
        if (data.temperature != 0 && data.humidity != 0)
        {
            // Format text, temp or hum. Goes into displayText
            if (humidityMode) {
                sprintf(displayText, "%.1fH", data.humidity);
            }
            else {
                sprintf(displayText, "%.1f*", data.temperature);
            }

            humidityMode = !humidityMode;
            // printf("\nhumidity: %d\n", (int)humidityMode);

            alarm(MEASURE_INTERVAL); 

            if (measure_counter++ == DB_WRITE_INTERVAL)
            {
                measure_counter = 0;
                // Store results in the db            
                char* msg = InsertDB(data.temperature, data.humidity);
                if (!strcmp(msg, "ok"))
                {
                    syslog(LOG_ERR, strcat("DB return message: ", msg));
                }
            }
        }
        else
        {
            alarm(1);
        }
    }
}


int main()
{
    // Open syslog with a specific identity
    openlog("growcontrol", LOG_PID, LOG_USER);
    syslog(LOG_INFO, "Starting growcontrol");

    // Register the signal handler for SIGTERM => systemctl stop ...
    if (signal(SIGTERM, handleSigTerm) == SIG_ERR) {
        syslog(LOG_ERR, "Error setting up signal handler");
        return EXIT_FAILURE;
    }

    // configure raspberry pins, connected to the shift-register and the display
    StartDisplay();

    // Initialize SHT Sensor
    InitSHT();

    // Get Database ready
    if (InitDB() != 0)
    {
        exit(1);
    }

    // CTRL + C event
    signal(SIGINT, handleSigTerm);

    // start timer
    signal(SIGALRM, timer); 
    alarm(1); 
    
    // loop for displaying stuff on the 4-digit 7-segment display
    while (!terminate)
    {
        SetText(displayText);
    }
    
    syslog(LOG_INFO, "Exiting growcontrol. Cleaning up");

    // Perform cleanup tasks here
    TurnOffDisplay();
    CloseDB();
    closelog();

    return EXIT_SUCCESS;
}
