#include "sht31.h"

int file;
char* bus;

void InitSHT()
{
	// Create I2C bus
	bus = "/dev/i2c-1";
    // open i2c bus for reading and writing (RDWR)
	if((file = open(bus, O_RDWR)) < 0) 
	{
		syslog(LOG_ERR, "Failed to open the i2c bus");
		exit(1);
	}
	// Get I2C device, SHT31 I2C address is 0x44(68)
	ioctl(file, I2C_SLAVE, 0x44);
}

struct SensorData GetSHTData()
{
	// Send high repeatability measurement command
	// Command msb, command lsb(0x2C, 0x06)
	char config[2] = {0};
	config[0] = 0x2C;
	config[1] = 0x06;
	write(file, config, 2);
	sleep(1);

	// Read 6 bytes of data
	// temp msb, temp lsb, temp CRC, humidity msb, humidity lsb, humidity CRC
	char data[6] = {0};
	if(read(file, data, 6) != 6)
	{
        return (struct SensorData){0,0};
	}
	else
	{
        // Convert the data
        double cTemp = (((data[0] * 256) + data[1]) * 175.0) / 65535.0  - 45.0;
        // double fTemp = (((data[0] * 256) + data[1]) * 315.0) / 65535.0 - 49.0;
        double humidity = (((data[3] * 256) + data[4])) * 100.0 / 65535.0;

        // Output data to screen
        // printf("Temperature in Celsius : %.2f C \n", cTemp);
        // // printf("Temperature in Fahrenheit : %.2f F \n", fTemp);
        // printf("Relative Humidity is : %.2f RH \n", humidity);
        return (struct SensorData){ cTemp, humidity };
	}
}