#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <math.h>
#include <string.h>

#include <avr/io.h> 
#include <avr/interrupt.h>
#include <util/delay.h>
#include <cpu_speed.h>
#include <graphics.h>
#include <macros.h>
#include "lcd_model.h"
#include "usb_serial.h"
#include "uart.h"

#define FREQ     (8000000.0)
#define PRESCALE (1)

//Variables for debouncing
uint8_t mask = 0b00000111;
volatile uint8_t sw2_counter = 0;
volatile uint8_t sw2_closed;
volatile uint8_t sw1_counter = 0;
volatile uint8_t sw1_closed;

//Method for debouncing
void debounce_sw2()
{
    sw2_counter = ((sw2_counter << 1) & mask) | BIT_IS_SET(PINF, 5);

    if (sw2_counter == mask) 
    {
        sw2_closed = 1;
    }

    if (sw2_counter == 0) 
    {
        sw2_closed = 0;
    }
}

void debounce_sw1()
{
    sw1_counter = ((sw1_counter << 1) & mask) | BIT_IS_SET(PINF, 6);

    if (sw1_counter == mask) 
    {
        sw1_closed = 1;
    }

    if (sw1_counter == 0) 
    {
        sw1_closed = 0;
    }
}


//Debouncing interrupt
ISR(TIMER0_OVF_vect) 
{
    debounce_sw2();
    debounce_sw1();
}

//Constants
const int sbh = 9;

//Game Conditions
bool next_level = false;
bool game_over = false;
bool door = false;
bool milk = false;
bool super_mode = false;
bool pause_state = false;
bool start = false;

//Global Variables
int level = 1;
int lives = 5;
int score = 0;
int time_s = 0;
int time_m = 0;
int cheese = 0;
int traps = 0;
int rockets = 0;

//Struct holding all of Jerry's variables
struct Jerry 
{
    int start_pos_x, start_pos_y, pos_x, pos_y;
    bool positiveX, positiveY; 
    int spriteX[6], spriteY[6];
    int collected_cheese;
    int rx[20], ry[20];
    bool rocket_state;
} J;

//Struct holding all of Tom's variables
struct Tom
{
    double start_pos_x, start_pos_y, pos_x, pos_y;
    double dx, dy;
    int spriteX[5], spriteY[5];
} T;

//Struct holding all of the coordinates for the walls
struct Wall
{
    int pos_x[12];
    int pos_y[12];
}W;

//Struct holding all of the item variables
struct Items
{
    //Note: c = cheese, t = trap, m = milk, d = door, s = sprite
    int cx[5], cy[5], csx[4], csy[4];
    int tx[5], ty[5], tsx[5], tsy[5];
    int mx, my, msx[5], msy[5];
    int dx, dy, dsx[8], dsy[8];
}I;

//Variables for timer
volatile uint32_t cycle_count = 0;
volatile uint32_t cheese_cycle = 0;
volatile uint32_t trap_cycle = 0;
volatile uint32_t milk_cycle = 0;
volatile uint32_t cooldown = 0;
volatile uint32_t super_cycle = 0;

//Interrupt service for timer 3 which resets and increments time_m when time_s is greater than 59
ISR(TIMER3_OVF_vect) {
    //Prevents the timer from continuing if the game is paused
    if (pause_state == false)
    {
        //Game time
        cycle_count++;

        if (time_s > 59)
        {
            cycle_count = 0;
            time_m ++;
        }

        //Timing for the cheese which is set to 0 once maximum cheese has been reached (so it can be 2 seconds from last pickup)
        if (cheese < 5 && start == true) cheese_cycle++;
        else cheese_cycle = 0;

        //Timing for the traps
        if (traps < 5 && start == true) trap_cycle++;
        else trap_cycle = 0;

        //Cooldown for the rockets
        cooldown++;

        //Timing for milk
        if (milk == false) milk_cycle++;
        else milk_cycle = 0;

        //Timing for supermode
        if (super_mode == true) super_cycle++;
        else super_cycle = 0;
    }
}

//Timer function
double now(int cycle_count)
{
    double time = (cycle_count * 65536.0 + TCNT3) * PRESCALE  / FREQ;
    return time;
}

//Helper functions
char buffer[50];

void draw_timer(uint8_t x, uint8_t y, int value, colour_t colour) 
{
	snprintf(buffer, sizeof(buffer), "%02d", value);
	draw_string(x, y, buffer, colour);
}

void draw_int(uint8_t x, uint8_t y, int value, colour_t colour) 
{
	snprintf(buffer, sizeof(buffer), "%d", value);
	draw_string(x, y, buffer, colour);
}

void usb_serial_send(char * message) {
	// Cast to avoid "error: pointer targets in passing argument 1 
	//	of 'usb_serial_write' differ in signedness"
	usb_serial_write((uint8_t *) message, strlen(message));
}

//Mmethod used to remove elements from arrays
void array_remove(int *array, int index)
{
    int i;

    for (i = index; i < cheese; i++)
    {
        array[i] = array[i + 1];
    }
}

//Mehtod for creating the start screen
void startScreen() 
{
    draw_string(LCD_X / 5, 0, "Dylan Chalk", FG_COLOUR);
    draw_string(LCD_X / 4, 10, "n10482857", FG_COLOUR);
    draw_string(LCD_X / 7, 20, "Tom and Jerry", FG_COLOUR);
    draw_string(LCD_X / 4, 30, "Into The", FG_COLOUR);
    draw_string(LCD_X / 5, 40, "Teensyverse", FG_COLOUR);
}

//Method for setting up Tom's movement values
void setupMovement()
{
    //Getting random numbers for Tom's movement
    int movement_x = rand() % (10 - 1) + 1;
    int movement_y = rand() % (10 - 1) + 1;
    const double speed = 0.1;

    //Setting dx and dy for Tom
    T.dx = speed * -movement_x;
    T.dy = speed * -movement_y;
}

//Method for storing the relative difference between an objects center and its pixels
void setSprites()
{
    //Jerry's sprite
    int *psx = J.spriteX;
        *psx++ = 0; *psx++ = 1; *psx++ = -1; *psx++ = 1;
        *psx++ = 0; *psx++ = -1;

    int *psy = J.spriteY;
        *psy++ = -1; *psy++ = 0; *psy++ = 0; *psy++ = 1;
        *psy++ = 1; *psy++ = 1;

    //Tom's sprite
    int *pTsx = T.spriteX;
        *pTsx++ = 0; *pTsx++ = -1; *pTsx++ = 1; *pTsx++ = -1;
        *pTsx++ = 1;

    int *pTsy = T.spriteY;
        *pTsy++ = 0; *pTsy++ = -1; *pTsy++ = -1; *pTsy++ = 1;
        *pTsy++ = 1;

    //Cheese sprite
    int *pcsx = I.csx;
        *pcsx++ = 0; *pcsx++ = 1; *pcsx++ = 1; *pcsx++ = 0;
    
    int *pcsy = I.csy;
        *pcsy++ = 0; *pcsy++ = 1; *pcsy++ = 0; *pcsy++ = 1;

    //Door sprite
    int *pdsx = I.dsx;
        *pdsx++ = 1; *pdsx++ = 0; *pdsx++ = -1; *pdsx++ = 1;
        *pdsx++ = -1; *pdsx++ = 1; *pdsx++ = -1; *pdsx++ = 0;

    int *pdsy = I.dsy;
        *pdsy++ = 1; *pdsy++ = 1; *pdsy++ = 1; *pdsy++ = 0;
        *pdsy++ = 0; *pdsy++ = -1; *pdsy++ = -1; *pdsy++ = -1;

    //Trap sprite
    int *ptsx = I.tsx;
        *ptsx++ = 0; *ptsx++ = 0; *ptsx++ = 0; *ptsx++ = -1;
        *ptsx++ = 1;
    
    int *ptsy = I.tsy;
        *ptsy++ = 0; *ptsy++ = -1; *ptsy++ = 1; *ptsy++ = 1;
        *ptsy++ = 1;

    //Milk sprite
    int *pmsx = I.msx;
        *pmsx++ = 0; *pmsx++ = 0; *pmsx++ = 0; *pmsx++ = -1;
        *pmsx++ = 1;
    
    int *pmsy = I.msy;
        *pmsy++ = 0; *pmsy++ = -1; *pmsy++ = 1; *pmsy++ = 0;
        *pmsy++ = 0;
}

void setup_area()
{
    //Assigning level 1 preset values
    if (level == 1) 
    {
        //Assigning Tom and Jerry's initial positions for use later
        T.start_pos_x = -5 + LCD_X;
        T.start_pos_y = -9 + LCD_Y;
        J.start_pos_x = 1;
        J.start_pos_y = sbh + 2;

        
        //W.pos_x = {18, 13, 25, 25, 45, 60, 58, 72};
        //W.pos_y = {15, 25, 35, 45, 10, 10, 25, 30};

        //Assigning all of the initial wall position values
        int *px = W.pos_x;
        *px++ = 18; *px++ = 13; *px++ = 25; *px++ = 25;
        *px++ = 45; *px++ = 60; *px++ = 58; *px++ = 72;

        int *py = W.pos_y;
        *py++ = 15; *py++ = 25; *py++ = 35; *py++ = 45;
        *py++ = 10; *py++ = 10; *py++ = 25; *py++ = 30;

        //Setting the sprite arrays for each character
        setSprites(); 
    }

    //Assigning Tom and Jerry's actual position values
    T.pos_x = T.start_pos_x;
    T.pos_y = T.start_pos_y;
    J.pos_x = J.start_pos_x;
    J.pos_y = J.start_pos_y;

    if (level == 2)
    {
        //Setting up the usb serial connection
        usb_init();

        //Blocking until it is ready
        while (!usb_configured()) { }
    }
}

//Method for the initial setup of the game
void setup() 
{
    //Basic initialisation
    set_clock_speed(CPU_8MHz);
	lcd_init(LCD_LOW_CONTRAST);
    lcd_clear();

    //Enabling all inputs
    CLEAR_BIT(DDRB, 0);     //Joystick Centre
    CLEAR_BIT(DDRB, 1);     //Joystick Left
    CLEAR_BIT(DDRD, 0);     //Joystick Right
    CLEAR_BIT(DDRD, 1);     //Joystick Up
    CLEAR_BIT(DDRB, 7);     //Joystick Down
    CLEAR_BIT(DDRF, 5);     //Switch 2
    CLEAR_BIT(DDRF, 6);     //Switch 1

    //Enabling output to LED0 and LED1
    SET_BIT(DDRB, 2);
    SET_BIT(DDRB, 3);

    //Initialising timer 0 in normal mode
    CLEAR_BIT(DDRD, 1);
    CLEAR_BIT(DDRB, 7);

    //Setting up timer 3 and enabling timer overload (game timer)
    TCCR3A = 0;
	TCCR3B = 1; 
    TIMSK3 = 1;

    //Setting up timer 0 and enabling timer overflow (debouncing)
    TCCR0A = 0;
	TCCR0B = 4;
    TIMSK0 = 1;
    
    //Enabling interrupts
    sei();

    //Drawing the starting screen
    startScreen();

    //Assigning all intial values
    setup_area();

    //Displaying the screen
    show_screen();
}

//Method for drawing the status bar
void drawStatusBar()
{
    //Getting the value for time using the time function called now
    time_s = now(cycle_count);
    
    //Drawing the separating line
    draw_line(0, 9, LCD_X, 9, FG_COLOUR);

    //Level
    draw_string(0, 0, "lvl", FG_COLOUR);
    draw_int(14, 0, level, FG_COLOUR);

    //Lives
    draw_string(24, 0, "L", FG_COLOUR);
    draw_int(30, 0, lives, FG_COLOUR);

    //Score
    draw_string(40, 0, "s", FG_COLOUR);
    draw_int(46, 0, score, FG_COLOUR);

    //Timer
    draw_timer((-24 + LCD_X), 0, time_m / 5, FG_COLOUR);
    draw_string((-14 + LCD_X), 0, ":", FG_COLOUR);
    draw_timer((-10 + LCD_X), 0, time_s, FG_COLOUR);
}

//Method for drawing Jerry
void drawJerry() 
{
    for (int i = 0; i < 6; i++)
    {
        draw_pixel(J.pos_x + J.spriteX[i], J.pos_y + J.spriteY[i], FG_COLOUR);
    }
}

//Method for drawing Tom
void drawTom()
{
    for (int i = 0; i < 5; i++)
    {
        draw_pixel(T.pos_x + T.spriteX[i], T.pos_y + T.spriteY[i], FG_COLOUR);
    }
}

//Method for drawing the walls
void drawWalls()
{
    int dx;
    int dy;
    double speed = 0.1;

    //Moving the walls and drawing them every frame    
    for (int i = 0; i < 8; i += 2)
    {
        if (pause_state == false && start == false)
        {
            dx = (W.pos_x[i] - W.pos_x[i+1]) * speed;
            dy = (W.pos_y[i] - W.pos_y[i+1]) * speed;

            W.pos_x[i] += dy;
            W.pos_x[i+1] += dy;
    
            W.pos_y[i] += dx;
            W.pos_y[i+1] += dx;

            if (W.pos_x[i] > LCD_X && W.pos_x[i+1] > LCD_X)
            {
                W.pos_x[i] = 0;
                W.pos_x[i+1] = W.pos_x[i] + dx;
            }

            if (W.pos_y[i] > LCD_Y && W.pos_y[i+1] > LCD_Y)
            {
                W.pos_y[i] = 10;
                W.pos_y[i+1] = W.pos_y[i] + dy;
            }

            if (W.pos_x[i] < 0 && W.pos_x[i+1] < 0)
            {
                W.pos_x[i] = LCD_X;
                W.pos_x[i+1] = W.pos_x[i] + dx;
            }

            if (W.pos_y[i] < 10 && W.pos_y[i+1] < 10)
            {
                W.pos_y[i] = LCD_Y;
                W.pos_y[i+1] = W.pos_y[i] + dy;
            }
        }

        //Drawing the walls
        draw_line(W.pos_x[i], W.pos_y[i], W.pos_x[i+1], W.pos_y[i+1], FG_COLOUR);
    }
}

//Wall collision detection
void wallCollision()
{

    for (int k = 0; k < 8; k += 2)
    {
        int x1 = W.pos_x[k];
        int x2 = W.pos_x[k+1];
        int y1 = W.pos_y[k];
        int y2 = W.pos_y[k+1];

        //Detect vertical
        if ( x1 == x2 ) 
        {
            for ( int i = y1; (y2 > y1) ? i <= y2 : i >= y2; (y2 > y1) ? i++ : i-- ) 
            {
                //Jerry collision with a wall
                for (int j = 0; j < 6; j++)
                {
                    //Allowing Jerry to pass through walls in super mode
                    if (super_mode == false)
                    {
                        if (J.pos_x + J.spriteX[j] == x1 && J.pos_y + J.spriteY[j] == i)
                        {
                            //Detecting the direction Jerry is moving so that he is prevented from continuing
                            if (J.positiveX == true) J.pos_x -= 1;
                            else J.pos_x += 1;
                        }
                    }

                    if (j > 0)
                    {
                        if (floor(T.pos_x) + T.spriteX[j-1] == x1 && floor(T.pos_y) + T.spriteY[j-1] == i)
                        {
                            T.dx = -T.dx;
                        }
                    }
                }
                
                if (rockets > 0)
                {
                    //Rocket collision with a wall
                    for (int r = 0; r < rockets; r++)
                    {
                        if (J.rx[r] == x1 && J.ry[r] == i)
                        {
                            //Removing the rocket that collided with Tom
                            array_remove(J.rx, r);
                            array_remove(J.ry, r);

                            //Decrementing rocket count
                            rockets--;
                        }
                    }
                }
            }
        }

        //Detect horizontal
        else if ( y1 == y2 ) 
        {
            for ( int i = x1; (x2 > x1) ? i <= x2 : i >= x2; (x2 > x1) ? i++ : i-- ) 
            {
                for (int j = 0; j < 6; j++)
                {
                    //Allowing Jerry to pass through walls if he's in super mode
                    if (super_mode == false)
                    {
                        if (J.pos_x + J.spriteX[j] == i && J.pos_y + J.spriteY[j] == y1)
                        {
                            //Detecting the direction Jerry is moving so that he is prevented from continuing
                            if (J.positiveY == true) J.pos_y -= 1;
                            else J.pos_y += 1;
                        }
                    }
                    
                    if (j > 0)
                    {
                        //Collision detection for Tom's bounce
                        if (floor(T.pos_x) + T.spriteX[j-1] == i && floor(T.pos_y) + T.spriteY[j-1] == y1)
                        {
                            T.dy = -T.dy;
                        }
                    }
                }

                if (rockets > 0)
                {
                    //Rocket collision with a wall
                    for (int r = 0; r < rockets; r++)
                    {
                        if (J.rx[r] == i && J.ry[r] == y1)
                        {
                            //Removing the rocket that collided with Tom
                            array_remove(J.rx, r);
                            array_remove(J.ry, r);

                            //Decrementing rocket count
                            rockets--;
                        }
                    }
                }
            }
	    }
    }

    /*
	else {
		//Always detect from left to right regardless of where the endpoints are located
		if ( x1 > x2 ) 
        {
			int t = x1;
			x1 = x2;
			x2 = t;
			t = y1;
			y1 = y2;
			y2 = t;
		}

		//Comment
		float dx = x2 - x1;
		float dy = y2 - y1;
		float err = 0.0;
		float derr = ABS(dy / dx);

		for ( int x = x1, y = y1; (dx > 0) ? x <= x2 : x >= x2; (dx > 0) ? x++ : x-- ) 
        {
			draw_pixel(x, y, colour);
			err += derr;
			while ( err >= 0.5 && ((dy > 0) ? y <= y2 : y >= y2) ) 
            {
				draw_pixel(x, y, colour);
				y += (dy > 0) - (dy < 0);
				err -= 1.0;
			}
		}
	}
    */
}

void getGameState()
{
    //Sending the timestamp
    snprintf(buffer, sizeof(buffer), "Timestamp: %02d:%02d \r\n", time_m, time_s);
    usb_serial_send(buffer);

    //Sending the current level
    snprintf(buffer, sizeof(buffer), "Current Level: %d \r\n", level);
    usb_serial_send(buffer);

    //Sending Jerry's lives
    snprintf(buffer, sizeof(buffer), "Jerry's Lives: %d \r\n", lives);
    usb_serial_send(buffer);

    //Sending Jerry's score
    snprintf(buffer, sizeof(buffer), "Score: %d \r\n", score);
    usb_serial_send(buffer);

    //Sending the number of fireworks currently on the screen
    snprintf(buffer, sizeof(buffer), "Fireworks on Screen: %d \r\n", rockets);
    usb_serial_send(buffer);

    //Sending the number of traps currently on the screen
    snprintf(buffer, sizeof(buffer), "Traps on Screen: %d \r\n", traps);
    usb_serial_send(buffer);

    //Sneding the number of cheese currently on the screen
    snprintf(buffer, sizeof(buffer), "Cheese on Screen: %d \r\n", cheese);
    usb_serial_send(buffer);

    //Sending the amount of shceese Jerry has consumed
    snprintf(buffer, sizeof(buffer), "Cheese Consumed: %d \r\n", J.collected_cheese);
    usb_serial_send(buffer);

    //Sending whether Jerry is in supermode or not
    snprintf(buffer, sizeof(buffer), "Supermode: %d \r\n", super_mode);
    usb_serial_send(buffer);

    //Sending whether the game is currently paused or not
    snprintf(buffer, sizeof(buffer), "Paused: %d \r\n", pause_state);
    usb_serial_send(buffer);
}

//Method for controlling the player character and game
void controls()
{
    //Variable which holds the last key that was pressed on the keybaord
    int key;

    //Getting the keyboard input if there is a serial connection
    if (usb_serial_available())
    {
        key = usb_serial_getchar();
    }  
    
    else
    {
        key = 0;
    } 

    //If joystick left is closed and Jerry will not move beyond the left side of the screen, move Jerry
    if ((BIT_IS_SET(PINB, 1) || key == 'a') && J.pos_x > 1)
    {
        J.pos_x -= 1;
        J.positiveX = false;
    }

    //If joystick right is closed and Jerry will not move beyond the right side of the screen, move Jerry
    if ((BIT_IS_SET(PIND, 0) || key == 'd') && J.pos_x < (-2 + LCD_X))
    {
        J.pos_x += 1;
        J.positiveX = true;
    }

    //If joystick up is closed and Jerry will not move beyond the status bar, move Kerry 
    if ((BIT_IS_SET(PIND, 1) || key == 'w') && J.pos_y > 11)
    {
        J.pos_y -= 1;
        J.positiveY = false;       
    }

    //If joystick down is closed and Jerry will not move beyond the bottom of the screen, move Jerry
    if ((BIT_IS_SET(PINB, 7) || key == 's') && J.pos_y < (-2 + LCD_Y))
    {
        J.pos_y += 1;
        J.positiveY = true;
    }

    //If joystick center is closed, Jerry has collected enough cheese and the cooldown is over, fire a rocket
    if ((BIT_IS_SET(PINB, 0) || key == 'f') && J.collected_cheese > 2 && now(cooldown) >= 1)
    {
        J.rocket_state = true;

        //Resetting the cooldown as a rocket has been fired
        cooldown = 0;
    }

    //If the left switch is closed move to the next level or end the game
    if (sw1_closed || key == 'l')
    {
        if (level == 1) next_level = true;
        else game_over = true;
    }

    //If the right switch is closed pause the game
    if ((sw2_closed == 1 || key == 'p') && start == true)
    {
        pause_state = !pause_state;
    }

    if (key == 'i')
    {
        getGameState();
    }
}

//Method for Tom's movement and collision
void AI()
{
    if (pause_state == false)
    {
        //Changing Tom's position based on his movement values
        T.pos_x += T.dx;
        T.pos_y += T.dy;

        //Checking if Tom collides with a horizontal boundary
        if (T.pos_x <= 1 || T.pos_x >= (-1 + LCD_X))
        {
            //Reversing horizontal direction (bouncing)
            T.dx = -T.dx;
        }

        //Checking if Tom collides with a verticle boundary
        if (T.pos_y <= 11 || T.pos_y >= (-1 + LCD_Y))
        {
            //Reversing verticle direction (bouncing)
            T.dy = -T.dy ;
        }
    }

    //Collision detection with Jerry
    for (int i = 0; i < 6; i++)
    {
        for (int j = 0; j < 5; j++)
        {
            if ((J.pos_x + J.spriteX[i] == floor(T.pos_x) + T.spriteX[j] && J.pos_y + J.spriteY[i] == floor(T.pos_y) + T.spriteY[j]))
            {
                //Resetting Tom and Jerry to their initial positions
                J.pos_x = J.start_pos_x;
                J.pos_y = J.start_pos_y;
                T.pos_x = T.start_pos_x;
                T.pos_y = T.start_pos_y;

                //Decrementing total cheese, giving Jerry a point and incrementing collected cheese
                if (super_mode == false) lives--;
                else score++;                
            }
        }
    }
}

//Method which transitions the game to the next level and resets certain global variables
void nextLevel()
{
    if (next_level == true)
    {
        next_level = false;
        level = 2;
        cheese = 0;
        J.collected_cheese = 0;
        traps = 0;
        door = false;
        rockets = 0;

        setup_area();
    }
}

//Method for producing the game over state
void gameOver()
{
    if (game_over == true)
    {
        clear_screen();

        //Displaying the game over screen
        while(game_over == true)
        {
            draw_string(LCD_X / 4, LCD_Y / 3, "Game Over!", FG_COLOUR);
            show_screen();

            //Checking if the player clicks the reset button
            if (BIT_IS_SET(PINF, 5))
            {
                game_over = false;
            }
        }

        //Resetting all of the variables and conditions
        next_level = false;
        level = 1;
        cheese = 0;
        J.collected_cheese = 0;
        traps = 0;
        door = false;
        score = 0;
        cycle_count = 0;
        cheese_cycle = 0;
        trap_cycle = 0;
        lives = 5;
        rockets = 0;

        //Resetting all initial object and chracter positions
        setup_area(); 
    }
}

//Method for drawing the cheese at 2 second intervals to a maximum of 5
//Note: The remainder from fmod has a tolerance of +-0.045 as it doesn't work when asking for a remainder of exactly 0
void drawCheese() 
{
    float cheese_time = now(cheese_cycle);

    //Prevents cheese being created if the game is pasued
    if (pause_state == false)
    {
        //Generating the positions of the cheese
        if (cheese < 5 && (fmod(cheese_time, 2) > -0.045 && fmod(cheese_time, 2) < 0.045) && cheese_time >= 2)
        {
            I.cx[cheese] = rand() % (-1 + LCD_X);
            I.cy[cheese] = rand() % (-11 + LCD_Y) + 10;

            cheese++;
        }
    }    

    //Drawing the cheese every frame
    for (int i = 0; i < cheese; i++)
    {
        for (int j = 0; j < 4; j++)
        {
            draw_pixel(I.cx[i] + I.csx[j], I.cy[i] + I.csy[j], FG_COLOUR);
        }
    }

    //Cheese collision detection with Jerry
    for (int i = 0; i < cheese; i++)
    {
        for (int j = 0; j < 6; j++)
        {
            for (int k = 0; k < 4; k++)
            {
                if ((J.pos_x + J.spriteX[j] == I.cx[i] + I.csx[k] && J.pos_y + J.spriteY[j] == I.cy[i] + I.csy[k]))
                {
                    //Removing the cheese that collided with Jerry
                    array_remove(I.cx, i);
                    array_remove(I.cy, i);

                    //Decrementing total cheese, giving Jerry a point and incrementing collected cheese
                    cheese--;
                    J.collected_cheese++;
                    score++;
                }
            }
        }
    }
}


//Method for drawing the door once Jerry has collected 5 pieces of cheese
void drawDoor()
{
    //Prevents the door from being created if the game is paused
    if (pause_state == false)
    {
        //Generating the position of the door
        if (J.collected_cheese > 4 && door == false)
        {
            I.dx = rand() % (-2 + LCD_X) + 1;
            I.dy = rand() % (-12 + LCD_Y) + 11;

            door = true;
        }
    }

    if (door == true)
    {
        //Drawing the door every frame
        for (int i = 0; i < 8; i++)
        {
            draw_pixel(I.dx + I.dsx[i], I.dy + I.dsy[i], FG_COLOUR);
        }
    }

    //Door collision detection with Jerry
    for (int i = 0; i < 6; i++)
    {
        for (int j = 0; j < 8; j++)
        {
            if ((J.pos_x + J.spriteX[i] == I.dx + I.dsx[j] && J.pos_y + J.spriteY[i] == I.dy + I.dsy[j]))
            {
                //Setting the next_level condition to true if it's on level 1
                if (level == 1)
                {
                    next_level = true;
                }

                //Setting the game_over condition to true if it's on level 2
                else if (level == 2)
                {
                    game_over = true;
                }
            }
        }
    }
}

//Method for drawing the mousetraps that Tom leaves behind for Jerry
void drawMousetrap()
{
    float trap_time = now(trap_cycle);
    
    //Prevents the traps from being created if the game is paused
    if (pause_state == false)
    {
        if (traps < 5 && (fmod(trap_time, 3) > -0.04 && fmod(trap_time, 3) < 0.04) && trap_time >= 3)
        {
            //Generating the position of the traps based on Tom's position
            I.tx[traps] = T.pos_x;
            I.ty[traps] = T.pos_y;

            traps++;
        }
    }

    //Drawing the traps every frame
    for (int i = 0; i < traps; i++)
    {
        for (int j = 0; j < 5; j++)
        {
            draw_pixel(I.tx[i] + I.tsx[j], I.ty[i] + I.tsy[j], FG_COLOUR);
        }
    }

    //If Jerry is in supermode then ignore collision
    if (super_mode == false)
    {
        //Trap collision detection with Jerry
        for (int i = 0; i < traps; i++)
        {
            for (int j = 0; j < 6; j++)
            {
                for (int k = 0; k < 5; k++)
                {
                    if ((J.pos_x + J.spriteX[j] == I.tx[i] + I.tsx[k] && J.pos_y + J.spriteY[j] == I.ty[i] + I.tsy[k]))
                    {
                        //Removing the cheese that collided with Jerry
                        array_remove(I.tx, i);
                        array_remove(I.ty, i);

                        //Removing a life from Jerry and decrementing total traps
                        lives--;
                        traps--;
                    }
                }
            }
        }
    }
}

//Method for drawing the rocket that Jerry fires
void drawRocket()
{
    //Constant speed values
    double dx = 1;
    double dy = 1;

    //Generating the initial positions of the rockets based on Jerry's position
    if (J.rocket_state && rockets <= 20)
    {
        J.rx[rockets] = J.pos_x;
        J.ry[rockets] = J.pos_y;

        J.rocket_state = false;
        rockets++;
    }

    //Moving the rockets towards Tom
    for (int i = 0; i < rockets; i++)
    {
        if (T.pos_x > J.rx[i]) dx = fabs(dx);
        else dx = fabs(dx) * (-1);
        J.rx[i] += dx;

        if (T.pos_y > J.ry[i]) dy = fabs(dy);
        else dy = fabs(dy) * (-1);
        J.ry[i] += dy;
    }

    //Drawing the rockets every frame if there are any on screen
    if (rockets > 0)
    {
        for (int i = 0; i < rockets; i++)
        {
            draw_pixel(J.rx[i], J.ry[i], FG_COLOUR);
        }
    }

    //Rocket collision detection
    for (int i = 0; i < rockets; i++)
    {
        for (int j = 0; j < 5; j++)
        {
            if (J.rx[i] == floor(T.pos_x) + T.spriteX[j] && J.ry[i] == floor(T.pos_y) + T.spriteY[j])
            {
                //Removing the rocket that collided with Tom
                array_remove(J.rx, i);

                //Decrementing rocket count and incrementing score
                rockets--;
                score++;

                //Resetting Tom to his starting position
                T.pos_x = T.start_pos_x;
                T.pos_y = T.start_pos_y;
            }
        }
    }


}


//Method for drawing the milk that Tom drops
void drawMilk() 
{
    float milk_time = now(milk_cycle);

    //Milk will only be created if it is level 2
    if (level > 1)
    {
        //Generating milk at 5 second intervals if there isn't already one present
        if (milk == false && (fmod(milk_time, 5) > -0.045 && fmod(milk_time, 5) < 0.045) && milk_time >= 5)
        {
            I.mx = T.pos_x;
            I.my = T.pos_y;

            milk = true;
        }

        //Redrawing the milk each frame if there is currently one present
        if (milk == true)
        {
            for (int i = 0; i < 5; i++)
            {
                draw_pixel(I.mx + I.msx[i], I.my + I.msy[i], FG_COLOUR);
            }
        }

        //Milk collision detection with Jerry
        for (int i = 0; i < 6; i++)
        {
            for (int j = 0; j < 5; j++)
            {
                if ((J.pos_x + J.spriteX[i] == I.mx + I.msx[j] && J.pos_y + J.spriteY[i] == I.my + I.msy[j]))
                {
                    //Giving Jerry supermode
                    super_mode = true;
                    milk = false;
                }
            }
        }
    }
}

//Method for super mode settings
void superMode()
{
    if (super_mode == true)
    {
        //Setting super_mode to false once the duration has been exceeded
        if (now(super_cycle) >= 10) super_mode = false;

        //LED pulse width modulation
    }
}

void process() 
{
    //Starting the game when the right switch is pressed
    if (BIT_IS_SET(PINF, 5) && start == false)
    {
        start = true;

        //Setting the seed value based on when the user clicks the right switch
        srand(cycle_count);

        //Setting up Tom's movement
        setupMovement();

        //Resetting the cycle count to start the timer at game start
        cycle_count = 0;
    }

    if (start == false)
    {
        return;
    }

    clear_screen();

    //Drawing the status bar and the walls
    drawStatusBar();
    drawWalls();

    //Controlling and drawing Jerry
    controls();
    wallCollision();
    drawJerry();

    //Moving and drawing Tom
    AI();
    drawTom();

    //Drawing all of the items
    drawCheese();
    drawDoor();
    drawMousetrap();
    drawRocket();
    drawMilk();

    //Super mode settings
    superMode();

    //Going to the next level if the conditions in the function are met
    nextLevel();

    //Setting game_over to true if Jerry runs out of lives
    if (lives < 1)
    {
        game_over = true;
    }

    //Ending the game if the conditions in the function are met
    gameOver();

    show_screen();
}


int main()
 {
	setup();

	while(1)
    {
		process();
	}

    return 0;
}