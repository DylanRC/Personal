#include <math.h>
#include <stdlib.h>
#include <string.h>
#include <limits.h>
#include <time.h>
#include <cab202_graphics.h>
#include <cab202_timers.h>

//Declaring global variables and initialising them with default values
//Declaring conditions
bool quit = false;
bool next_level = true;
bool door = false;
bool pause_state = false;

//Status_bar variables
int std_num = 10482857;
int score = 0;
int lives = 5;
char player = 'J';
int timer_s = 0;
int timer_m = 0;
int cheese = 0;
int traps = 0;
int rockets = 0;
int level = 0;

//Creating the timer and declaring the start time
time_t time(time_t *_timer);
long start_time;

//Initialising the re_draw variable which holds the symbol of what will be redrawn
char re_draw = ' ';

//Declaring a struct to hold all of Jerry's pertinent variables
struct Jerry 
{
    float start_pos_x, start_pos_y, pos_x, pos_y, rx, ry;
    double dx, dy, rdx, rdy;
    int collected_cheese;
    bool rocket;
} J;

//Declaring a struct to hold all of Tom's pertinent variables
struct Tom
{
    float start_pos_x, start_pos_y, pos_x, pos_y;
    int cx, cy;
    double dx, dy;
} T;

void setup_movement()
{
    //Setting up random movement values
    float movement_x = rand() % (10 - 1) + 1;
    float movement_y = rand() % (10 - 1) + 1;
    const float speed = 0.0125;

    //Setting dx and dy for Tom
    T.dx = speed * movement_x;
    T.dy = speed * movement_y;
}

void draw_status_bar()
{
    //Drawing the status bar
    draw_formatted(0, 0, "Student Number: n%d    Score: %d     Lives: %d     Player: %c     Time: %02d:%02d", std_num, score, lives, player, timer_m, timer_s);
    draw_formatted(0, 2, "Cheese: %d                    Traps: %d     Rockets: %d   Level: %d", cheese, traps, rockets, level);
}

int collision()
{
    //Checking the bounds of the screen
    if (J.pos_x < 0) return 1;
    if (J.pos_x > screen_width() - 1) return 1;
    if (J.pos_y < 4) return 1;
    if (J.pos_y > screen_height() - 1) return 1;

    //Checking the current symbol to determine a course of action
    char object = scrape_char(round(J.pos_x), round(J.pos_y));

    //Checking if the object is a wall
    if (object == '*') return 1;

    //Checking if the object cheese
    if (object == 'C') return 2;

    //Checking if the object is a door
    if (object == 'X') return 3;

    //Checking if the object is Tom
    if (object == 'T') return 4;

    //Checking if the object is a mousetrap
    if (object == 'M') return 5;

    return 0;
}

void create_cheese()
{
    //Checking if the game is paused
    if (pause_state) return;

    //Declaring cheese variables
    int cheese_x;
    int cheese_y;
    char object;

    //Continue creating random coordinates if they collide with other elements
    do
    {
        cheese_x = rand() % screen_width();
        cheese_y = round(rand() % (screen_height() - 5) + 5);
        object = scrape_char(cheese_x, cheese_y);
    }while(object == '*' || object == 'M' || object == 'C' || object == 'T' || object == 'J');

    //Draw the cheese if there isn't already 5 on the screen and the game is 2 seconds in
    if (cheese < 5 && ((timer_s + 2) / ((cheese + 1)) % 2 == 0))
    {
        draw_char(cheese_x, cheese_y, 'C');
        cheese++;
    }   
}

void create_door()
{
    //Checking if the game is paused
    if (pause_state) return; 

    //Declaring door variables
    int door_x;
    int door_y;
    char object;

    //Continue creating random coordinates if they collide with other elements
    do
    {
        door_x = rand() % screen_width();
        door_y = round(rand() % (screen_height() - 5) + 5);
        object = scrape_char(door_x, door_y);
    } while (object == '*' || object == 'M' || object == 'C' || object == 'T' || object == 'J');

    //Draw the door if Jerry has collected the right amount of cheese and there isnt already a door
    if (J.collected_cheese > 4 && door == 0)
    {
        draw_char(door_x, door_y, 'X');
        door = true;
    }
}

void create_trap()
{
    //Checking if the game is paused
    if (pause_state) return;

    //Creating the trap at each time interval and iterating the counter
    if (traps < 5 && ((timer_s - 1) / ((traps + 1)) % 3 == 0))
    {
        draw_char(T.pos_x, T.pos_y, 'M');
        traps++;
    }
}

void setup_rocket()
{
    //Setting constant speed value
    const int speed = 0.125;

    //Setting the rocket's intial position to be that of Jerry's
    J.rx = J.pos_x;
    J.ry = J.pos_y;

    //Setting movement values based on the difference between Tom and Jerry, multiplied by a speed constant
    J.rdx = (J.pos_x - T.pos_x) * speed;
    J.rdy = (J.pos_y - T.pos_y) * speed;

    //Setting the rocket condition to true so that movement is true and another rocket cannot be fired
    J.rocket = true;
    rockets++;
}

void rocket_movement()
{
    //Removing previous position
    draw_char(J.rx, J.ry, ' ');

    J.rx += J.rdx;
    J.ry += J.rdy;

    char object = scrape_char(J.rx, J.ry);
    if (object == '*' || object == 'T')
    {
        J.rocket = false;
        rockets--;
    } 
    
    draw_char(J.rx, J.ry, 'R');
}

void AI()
{
    //Checking if the game is paused
    if (pause_state) return;

    //Preventing the code from running if Tom is the current player
    if (player == 'T') return;

    //Testing Tom's position using new_x and new_y
    float new_x = T.pos_x + T.dx;
    float new_y = T.pos_y + T.dy;

    if (new_x < 0 || new_x > screen_width() - 1)
    {
        //Reversing horizontal direction if a boundry is collided with
        T.dx = -T.dx;
        new_x = T.pos_x + T.dx;
    }

    if (new_y < 4 || new_y > screen_height() - 1)
    {
        //Reversing verticle direction if a boundry is collided with
        T.dy = -T.dy;
        new_y = T.pos_y + T.dy;
    }

    if ((scrape_char(T.pos_x, T.pos_y + 1)  == '*') || (scrape_char(T.pos_x, T.pos_y - 0.1) == '*'))
    {
        T.dy = -T.dy;
        new_y = T.pos_y + T.dy;
    }

    if ((scrape_char(T.pos_x + 1, T.pos_y) == '*') || (scrape_char(T.pos_x - 0.1, T.pos_y) == '*'))
    {
        T.dx = -T.dx;
        new_x = T.pos_x + T.dx;
    } 
 
    // Move to new position
    T.pos_x = new_x;
    T.pos_y = new_y;

    //If a rocket hits Tom, Jerry's score goes up and Tom is reset back to the start
    if (scrape_char(T.pos_x, T.pos_y) == 'R')
    {
        T.pos_x = T.start_pos_x;
        T.pos_y = T.start_pos_y;
        score++;
    }
} 

void game_over()
{
    //Clearing the game screen and drawing the game over screen
    clear_screen();
    draw_formatted(screen_width() * 0.2, screen_height() * 0.4, "GAME OVER! YOU REACHED LEVEL %d WITH A SCORE OF %d", level, score);
    draw_formatted(screen_width() * 0.2, screen_height() * 0.6, "PRESS R TO RESTART AND ANY OTHER KEY TO QUIT");
    show_screen();

    //Get user input
    char decision = getchar();

    //If they input R, restart the game to its original state, otherwise quit
    if (decision == 'r' || decision == 'R') 
    {
        next_level = true;
        start_time = time(0);
        score = 0;
        lives = 5;
        player = 'J';
        timer_s = 0;
        timer_m = 0;
        cheese = 0;
        traps = 0;
        rockets = 0;
        level = 0;
    }    
    else quit = true;
}

void input_controls() 
{
    //Rounding the values
    J.pos_x = round(J.pos_x);
    J.pos_y = round(J.pos_y);

    //Placeholder values with positions
    float *pos_x, *pos_y;

    //Determining whether to move Tom or Jerry
    if (player == 'J')
    {
        pos_x = &J.pos_x;
        pos_y = &J.pos_y;
    }

    if (player == 'T')
    {
        pos_x = &T.pos_x;
        pos_y = &T.pos_y;
    }

    //Initialising input as the the character the user inputs
    char input = get_char();
    
    //Switch statement to execute commands based on input
    switch (input) 
    {
        case 'w':
        case 'W':
            *pos_y -= 1;
            if (collision() == 1) *pos_y += 1;
            break;
        case 'a':
        case 'A':
            *pos_x -= 1;
            if (collision() == 1) *pos_x += 1;
            break;
        case 's':
        case 'S':
            *pos_y += 1;
            if (collision() == 1) *pos_y -= 1;
            break;
        case 'd':
        case 'D':
            *pos_x += 1;
            if (collision() == 1) *pos_x -= 1;
            break;
        //Cycling through the levels
        case 'L':
        case 'l':
            next_level = true;
            break;
        //Pausing the game
        case 'P':
        case 'p':
            pause_state = !pause_state;
            break;
        //Swapping characters 
        case 'z':
        case 'Z':
            if (player == 'J') player = 'T';
            else player = 'J';
            break;
        //Going to the game over screen
        case 'q':
        case 'Q':
            game_over();
            break;
        case 'f':
        case 'F':
            if (J.rocket == false) setup_rocket();
            break;     
    }
}

void setup (FILE * stream) 
{
    //Initialising constants for absolute height and width as well as status bar height
    const int absolute_y = (screen_height()) - 5;
    const int absolute_x = (screen_width() - 1);
    const int sbh = 4;

    //  While stream has not reach end of input:
    while (!feof (stream))
    {
        //Resetting conditions
        door = false;
        next_level = false;

        //Resetting cheese and trap variables
        cheese = 0;
        J.collected_cheese = 0;
        traps = 0;

        // Declaring char, 'command'
        char command;

        // Declaring 4 float variables to be extracted from the input file
        float x1, y1, x2, y2;

        //Scanning input_files for 5 values and returning how many items were scanned
        int items_scanned = fscanf(stream, "%c %f %f %f %f", &command, &x1, &y1, &x2, &y2);
        // If the number of items scanned is 3:
        if (items_scanned == 3)
        {
            //If command variable is J
            if (command == 'J')
            {
                //Updating position variables based on the input file amd saving starting positions for later
                J.start_pos_x = absolute_x * x1;
                J.start_pos_y = absolute_y * y1 + sbh;

                J.pos_x = J.start_pos_x;
                J.pos_y = J.start_pos_y;

                //Drawing Jerry based on position variables
                draw_char(round(J.pos_x), round(J.pos_y), 'J');
            }
            //If command variable is T
            else if (command == 'T') 
            {
                //Updating position varaibles based on the input file and saving starting positions for later
                T.start_pos_x = absolute_x * x1;
                T.start_pos_y = absolute_y * y1 + sbh;

                T.pos_x = T.start_pos_x;
                T.pos_y = T.start_pos_y;

                //Drawing Tom based on position variables
                draw_char(round(T.pos_x), round(T.pos_y), 'T');
            }
        }

        //  Otherwise, if the number of items scanned is 5:
        else if (items_scanned == 5)
        {
            //If command variable is W
            if (command == 'W')
            {
                //Draw a wall based on the input file values
                draw_line(round(absolute_x * x1), round(absolute_y * y1 + sbh), round(absolute_x * x2), round(absolute_y * y2 + sbh), '*');
            }
        }
    }
    //Setting up automatic movement values
    setup_movement();

    //Drawing the line to separate the status bar from the play area
    draw_line(0, 3, absolute_x, 3, '-');

    //Drawing the status bar with initial values
    draw_status_bar();
    
    show_screen();

}
void loop() 
{
    //Drawing the status bar with the updated variables
    draw_status_bar();
    
    //Removing the previous Jerry and Tom so the new one can be drawn
    draw_char(round(J.pos_x), round(J.pos_y), ' ');
    draw_char(round(T.pos_x), round(T.pos_y), re_draw);

    //Removing Tom's previous position if the criteria is met
    if ((re_draw == 'C' || re_draw == 'M' || re_draw == 'X') && (T.cx != round(T.pos_x) || T.cy != round(T.pos_y))) re_draw = ' ';

    //Testing user input for 'W' 'A' 'S' 'D' controls and changing the positon values on that
    input_controls();

    //Drawinig Jerry's current positon
    draw_char(round(J.pos_x), round(J.pos_y), 'J');

    //Creating the traps
    create_trap();

    //Determining Tom's position, drawing him and saving any objects he's walked over so they can be replaced
    AI();
    char object = scrape_char(round(T.pos_x), round(T.pos_y));  
    if (object == 'C' || object == 'M' || object == 'X') 
    {
        re_draw = 'C';
        if (object == 'X') re_draw = 'X';
        if (object == 'M') re_draw = 'M';
        T.cx = round(T.pos_x);
        T.cy = round(T.pos_y);
    }
    draw_char(round(T.pos_x), round(T.pos_y), 'T');

    //Executing the rocket movement code if the rocket has been setup
    if (J.rocket) rocket_movement();

    //Creating the cheese, adding a point if Jerry collides with it and decreasing the number of cheese
    create_cheese();
    if (collision() == 2)
    {
        score++;
        J.collected_cheese++;
        cheese--;
        draw_char(J.pos_x, J.pos_y, ' ');
    }

    //Creating the door after the set conditions and checking if Jerry collides with it
    create_door();
    if (collision() == 3) next_level = true;

    //If Jerry collides with Tom he loses a life and positions are reset
    if (collision() == 4) 
    {
        //Removing a life
        lives--;

        //Removing their collision positions
        draw_char(round(J.pos_x), round(J.pos_y), ' ');
        draw_char(round(T.pos_x), round(T.pos_y), ' ');

        //Resetting their positions back to their starting point
        J.pos_x = J.start_pos_x;
        J.pos_y = J.start_pos_y;
        T.pos_x = T.start_pos_x;
        T.pos_y = T.start_pos_y;
    }

    //If Jerry hits a mousetrap he loses a life and the counter for traps is decremented
    if (collision() == 5)
    {
        //Removing a life
        lives--;

        //Decreasing trap counter
        traps--;
    }

    show_screen();

    //Checking game over condition
    if (lives <= 0)
    {
        game_over();
    } 
}

int main(int argc, char *argv[]) {
    //Setting up the screen
    setup_screen();

    //Setting a random seed value based on time
    srand(time(0));

    //Initialsing Tom's collision position
    T.cx = 0;
    T.cy = 0;

    //Initialsing rocket as false
    J.rocket = false;

    //Initialsing start time
    start_time = time(0);

    //Initialising pause_duration as 0
    int pause_duration = 0;

    //Setting delay;
    const double DELAY = 10;

    while (!quit) {
        //Setting up the required level
        if (next_level == true)
        {
            if (level + 1 > argc) game_over();
            clear_screen();
            level++;

            FILE * stream = fopen(argv[level], "r");
            if (stream != NULL)
            {
                setup(stream);
                fclose(stream);
            }
        }

        //Getting the runtime by subtracting the difference of start time and potential pause durations
        if (pause_state == false) timer_s = time(0) - start_time - pause_duration;

        //Determining duration paused
        if (pause_state == true) pause_duration = (time(0) - start_time - timer_s);
        
        //Once the timer is equals 60 reset the seconds and increment the minutes
        if (timer_s > 59)
        {
            timer_s = 0;
            timer_m++;
            start_time = time(0);   
        }

        loop();
        timer_pause(DELAY);
    }
    return 0;
}