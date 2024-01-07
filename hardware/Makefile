# Makefile for the C program with wiringPi library

# Compiler and flags
CC = gcc
CFLAGS = -Wall -Wextra -g

# Source files
SRC_DIR = src
SRC_FILES = main.c control.c sht31.c db.c
SRCS = $(addprefix $(SRC_DIR)/, $(SRC_FILES))

# Object files
OBJ_DIR = obj
OBJ_FILES = $(patsubst %.c, %.o, $(SRC_FILES))
OBJS = $(addprefix $(OBJ_DIR)/, $(OBJ_FILES))

# Executable name
TARGET = control

# WiringPi library
LIBS = -lwiringPi -lsqlite3

# Rule to build the executable
$(TARGET): $(OBJS)
	$(CC) $(CFLAGS) -o $@ $^ $(LIBS) 

# Rule to build object files
$(OBJ_DIR)/%.o: $(SRC_DIR)/%.c
	$(CC) $(CFLAGS) -c -o $@ $<

# Phony target to clean the project
.PHONY: clean
clean:
	rm -rf $(OBJ_DIR)/*.o $(TARGET)
