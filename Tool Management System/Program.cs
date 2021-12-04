using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CAB301_Assignment
{
    class Program
    {
        //Declare public static variables which are referenced for the current index
        public static int categoryIndex;
        public static int typeIndex;

        //Store a list of references to the added members so that MemberCollection doesn't need to be instantiated.
        //This is unideal, but, ToolLibrarySystem does not contain a single method that can check member details.
        private static List<Member> members = new List<Member>();
        private static Member currentMember;

        //Instaniate Program and ToolLibrarySystem
        private static ToolLibrarySystem system = new ToolLibrarySystem();
        private static Program pg = new Program();

        //Main Menu UI
        private static void mainMenu()
        {
            string[] menuElements = { "Staff Login", "Member Login" };

            menuGenerator("Main Menu", menuElements, "Exit");

            //Make sure a valid selection is made
            ConsoleKey key;
            ConsoleKey[] acceptedKeys = { ConsoleKey.D1, ConsoleKey.D2, ConsoleKey.D0 };

            do
            {
                key = Console.ReadKey().Key;
            } while (!acceptedKeys.Contains(key));

            Console.Clear();


            //Display staff login if user selects '1'
            if (key == ConsoleKey.D1)
            {
                string username;
                string password;

                Console.WriteLine("Welcome to the Tool Library\n" +
                    "===========Staff Login===========\n"
                );

                do
                {
                    Console.WriteLine("Username:");
                    username = Console.ReadLine();

                    Console.WriteLine("Password:");
                    password = Console.ReadLine();

                } while (username != "staff" || password != "today123");

                staffMenu();
            }

            //Display member login if user selects '2'
            else if (key == ConsoleKey.D2)
            {
                string firstName;
                string lastName;
                string pin;

                Console.WriteLine("Welcome to the Tool Library\n" +
                    "===========Member Login===========\n"
                );

                Console.WriteLine("First Name:");
                firstName = Console.ReadLine();

                Console.WriteLine("\nLast Name:");
                lastName = Console.ReadLine();

                Console.WriteLine("\nPassword:");
                pin = Console.ReadLine();
                Console.WriteLine();

                //Check the member details and either log them in or return them to the main menu
                for (int i = 0; i < members.Count; i++)
                {
                    if (members[i].FirstName == firstName && members[i].LastName == lastName && members[i].PIN == pin)
                    {
                        currentMember = members[i];
                        memberMenu();
                    }
                }

                Console.WriteLine("One or more of the provided details were incorrect. Press enter to return to the main menu");
                Console.ReadLine();

                mainMenu();

            }

            //End the program if user selects '0'
            else if (key == ConsoleKey.D0)
            {
                Environment.Exit(0);
            }
        }

        //Staff Menu
        private static void staffMenu()
        {
            Console.Clear();

            string[] menuElements = {
                "Add a new tool", "Add new pieces of an existing tool", "Remove some pieces of a tool", 
                "Register a new member", "Remove a member", "Find the contact number of a member"
            };

            menuGenerator("Staff Menu", menuElements, "Return to main menu");


            //Make sure a valid selection is made
            ConsoleKey key;
            ConsoleKey[] acceptedKeys = { ConsoleKey.D1, ConsoleKey.D2, ConsoleKey.D3, ConsoleKey.D4, 
                ConsoleKey.D5, ConsoleKey.D5, ConsoleKey.D6, ConsoleKey.D0 
            };

            do
            {
                key = Console.ReadKey().Key;
            } while (!acceptedKeys.Contains(key));


            //Submenu navigation
            switch (key)
            {
                //Generating the tool related menus
                case ConsoleKey.D1:
                case ConsoleKey.D2:
                case ConsoleKey.D3:
                    toolMenu(key);

                    break;

                //Adding Members
                case ConsoleKey.D4:
                    string firstName, lastName, contactNumber, pin;

                    Console.Clear();

                    Console.WriteLine("Welcome to the Tool Library\n" +
                    "===========Register a new member===========\n"
                );

                    do
                    {
                        Console.WriteLine("First Name:");
                        firstName = Console.ReadLine();
                        Console.WriteLine();

                    } while (firstName.Contains(' '));

                    do
                    {
                        Console.WriteLine("Last Name:");
                        lastName = Console.ReadLine();
                        Console.WriteLine();

                        } while (lastName.Contains(' '));

                    do
                    {
                        Console.WriteLine("Contact Number:");
                        contactNumber = Console.ReadLine();
                        Console.WriteLine();

                    } while (!int.TryParse(contactNumber, out _));

                    do
                    {
                        Console.WriteLine("Password:");
                        pin = Console.ReadLine();
                        Console.WriteLine();

                    } while (firstName.Contains(' '));

                    pg.addMember(firstName, lastName, contactNumber, pin);

                    staffMenu();

                    break;

                case ConsoleKey.D5:
                case ConsoleKey.D6:
                    //Generates a menu using the first name and last name of a member taken from the member list
                    menuGenerator(
                        key == ConsoleKey.D5 ? "Remove a member from the system" : "Retrieve contact number", 
                        members.Select(x => $"{ x.FirstName } { x.LastName }").ToArray(), 
                        "Return to staff menu"
                        );

                    int memberIndex;
                    do
                    {
                        Console.WriteLine("Member Index (0 to exit):");
                    } while (!int.TryParse(Console.ReadLine(), out memberIndex) || memberIndex < 0);
                    if (memberIndex == 0) { staffMenu(); }

                    if (memberIndex > members.Count)
                    {
                        Console.Write("\nNo members exist at the provided index. Press enter to return to the staff menu");
                        Console.ReadLine();
                    }


                    else
                    {
                        //If menu 5 is selected, delete the member
                        if (key == ConsoleKey.D5)
                        {
                            if (members[memberIndex - 1].Tools.Length > 0)
                            {
                                Console.Write("\nYou cannot remove a member who is currently borrowing a tool. Press enter to return to the staff menu");
                                Console.ReadLine();
                            }

                            else
                            {
                                system.delete(members[memberIndex - 1]);
                                members.RemoveAt(memberIndex - 1);
                            }
                        }

                        //If menu 6 is selected get the contact phone number of the member
                        else
                        {
                            Console.WriteLine($"Member contact number - {members[memberIndex - 1].ContactNumber}");
                            Console.ReadLine();
                        }
                    }

                    staffMenu();

                    break;
                case ConsoleKey.D0:
                    mainMenu();
                    break;
            }
        }


        //Function which is responsible for displaying the tools categories and types.
        public static void toolMenu(ConsoleKey menuType)
        {
            string[] toolCategories = {
                        "Gardening Tools", "Flooring Tools", "Fencing Tools", "Measuring Tools",
                        "Cleaning Tools", "Painting Tools", "Electronic Tools", "Electricty Tools", "Automotive Tools"
                    };


            //Array of arrays for tool types, indexes inline with associated tool category
            string[][] toolTypes = {
                        new string[] { "Line Trimmers", "Lawn Mowers", "Hand Tools", "Wheelbarrows", "Garden Power Tools" },
                        new string[] { "Scrapers", "Floor Lasers", "Floor Levelling Tools", "Floor Levelling Materials", "Floor Hand Tools", "Tiling Tools" },
                        new string[] { "Hand Tools", "Electric Fencing", "Steel Fencing Tools", "Power Tools", "Fencing Accessories" },
                        new string[] { "Distance Tools", "Laser Measurer", "Measuring Jugs", "Temperature & Humidty Tools", "Levelling Tools", "Markers" },
                        new string[] { "Draining", "Car Cleaning", "Vacuum", "Pressure Cleaners", "Pool Cleaning", "Floor Cleaning" },
                        new string[] { "Sanding Tools", "Brushes", "Rollers", "Paint Removal Tools", "Pain Scrapers", "Sprayers" },
                        new string[] { "Voltage Tester", "Oscilloscopes", "Thermal Imaging", "Data Test Tool", "Insulation Testers" },
                        new string[] { "Test Equipment", "Safety Equipment", "Basic Hand Tools", "Circuit Protection", "Cable Tools" },
                        new string[] { "Jacks", "Air Compressors", "Battery Chargers", "Socket Tools", "Braking", "Drivetrain" }
                    };

            menuGenerator("Tool Categories", toolCategories, "Return to menu");

            //Make sure a valid selection is made
            ConsoleKey key;
            ConsoleKey[] acceptedKeys1 = { ConsoleKey.D1, ConsoleKey.D2,
                        ConsoleKey.D3, ConsoleKey.D4, ConsoleKey.D5, ConsoleKey.D6, ConsoleKey.D7,
                        ConsoleKey.D8, ConsoleKey.D9
                    };

            do
            {
                key = Console.ReadKey().Key;
                if (key == ConsoleKey.D0)
                {
                    if (keyToNumber(menuType) <= 3) { staffMenu(); }
                    else { memberMenu(); }
                }
            } while (!acceptedKeys1.Contains(key));

            //Select the index of which tool types to display based on user input
            categoryIndex = keyToNumber(key) - 1;

            menuGenerator(toolCategories[categoryIndex], toolTypes[categoryIndex], "Return to menu");

            do
            {
                key = Console.ReadKey().Key;
                if (key == ConsoleKey.D0)
                {
                    if (keyToNumber(menuType) <= 3) { staffMenu(); }
                    else { memberMenu(); }
                }
            } while (keyToNumber(key) > toolTypes[categoryIndex].Length || keyToNumber(key) == -1);

            //Set the type index based on user selection and display approriate tools
            typeIndex = keyToNumber(key) - 1;
            system.displayTools(toolTypes[categoryIndex][typeIndex]);

            //Change aspects of tool menu based on the user selected menus
            switch (menuType)
            {
                //Deviation for staff menu 1
                case ConsoleKey.D1:
                    Console.WriteLine("Tool Name:");
                    string toolName = Console.ReadLine();
                    if (toolName == "0" || toolName == "" || toolName == " ") { toolMenu(menuType); }

                    pg.toolCreator(toolName, true);

                    toolMenu(menuType);
                    break;

                //Deviation for staff menu 2 and 3
                case ConsoleKey.D2:
                case ConsoleKey.D3:
                    int toolIndex;
                    int quantity;

                    do
                    {
                        Console.WriteLine("Tool Index (0 to exit):");
                    } while (!int.TryParse(Console.ReadLine(), out toolIndex) || toolIndex < 0);
                    if (toolIndex == 0) { toolMenu(menuType); }

                    Console.WriteLine("Quantity");
                    while (!int.TryParse(Console.ReadLine(), out quantity) || quantity < 1) ;
                    if (quantity == 0) { toolMenu(menuType); }

                    if (menuType == ConsoleKey.D2) { pg.toolCreator(toolIndex.ToString(), true, quantity); }
                    else { pg.toolCreator(toolIndex.ToString(), false, quantity); }

                    toolMenu(menuType);
                    break;

                //Deviation for member menu 1
                case ConsoleKey.D4:
                    Console.Write("\nPress enter to return to the tool menu");
                    Console.ReadLine();

                    toolMenu(menuType);
                    break;

                //Deviation for member menu 2
                case ConsoleKey.D5:
                    do
                    {
                        Console.WriteLine("Tool Index (0 to exit):");
                    } while (!int.TryParse(Console.ReadLine(), out toolIndex) || toolIndex < 0);
                    if (toolIndex == 0) { toolMenu(menuType); }

                    pg.borrow(toolIndex.ToString(), true);

                    toolMenu(menuType);
                    break;
            }
        }

        //Member Menu
        private static void memberMenu()
        {
            Console.Clear();

            string[] menuElements = {
                "Display all of the tools of a tool type", "Borrow a tool", "Return a tool",
                "List all the tools that I am renting", "Display top three (3) most frequently rented tools"
            };

            menuGenerator("Member Menu", menuElements, "Return to main menu");

            ConsoleKey key;
            ConsoleKey[] acceptedKeys = { ConsoleKey.D1, ConsoleKey.D2, ConsoleKey.D3, ConsoleKey.D4,
                ConsoleKey.D5, ConsoleKey.D5, ConsoleKey.D0
            };

            do
            {
                key = Console.ReadKey().Key;
                if (key == ConsoleKey.D0) { mainMenu(); }
            } while (!acceptedKeys.Contains(key));


            switch(key)
            {
                //Viewing a list of tools
                case ConsoleKey.D1:
                    toolMenu(ConsoleKey.D4);
                    break;

                //Borrowing a tool
                case ConsoleKey.D2:
                    toolMenu(ConsoleKey.D5);
                    break;

                //Returning a tool
                case ConsoleKey.D3:
                    int toolIndex;

                    system.displayBorrowingTools(currentMember);

                    do
                    {
                        Console.WriteLine("Tool Index (0 to exit):");
                    } while (!int.TryParse(Console.ReadLine(), out toolIndex) || toolIndex < 0);
                    if (toolIndex == 0) { memberMenu(); }

                    pg.borrow(toolIndex.ToString(), false);
                    memberMenu();
                    break;

                //Listing all the tools the user is renting
                case ConsoleKey.D4:
                    system.displayBorrowingTools(currentMember);
                    Console.Write("\nPress enter to return to the member menu ");
                    Console.ReadLine();
                    memberMenu();
                    break;

                //Listing the top three most borrowed tools
                case ConsoleKey.D5:
                    system.displayTopThree();
                    memberMenu();
                    break;
            }
        }


        //Generates a menu based on a provided title, menu elements and a key 0 (return) statement
        public static void menuGenerator(string title, string[] menuElements, string statement)
        {
            Console.Clear();

            Console.WriteLine("Welcome to the Tool Library\n" +
                    $"=========={title}==========="
            );

            for (int i = 0; i < menuElements.Length; i++)
            {
                Console.WriteLine($"{i+1}. {menuElements[i]}");
            }

            Console.WriteLine($"0. {statement}\n" +
                "========================================\n" +
                $"\nPlease make a selection (1-{menuElements.Length}, or 0 to {statement.ToLower()}):"
            );
        }

        //Helper function to reduce the number of switch/conditional statements used in the code
        private static int keyToNumber(ConsoleKey key)
        {
            int number;

            switch (key)
            {
                case ConsoleKey.D1:
                    number = 1;
                    break;
                case ConsoleKey.D2:
                    number = 2;
                    break;
                case ConsoleKey.D3:
                    number = 3;
                    break;
                case ConsoleKey.D4:
                    number = 4;
                    break;
                case ConsoleKey.D5:
                    number = 5;
                    break;
                case ConsoleKey.D6:
                    number = 6;
                    break;
                case ConsoleKey.D7:
                    number = 7;
                    break;
                case ConsoleKey.D8:
                    number = 8;
                    break;
                case ConsoleKey.D9:
                    number = 9;
                    break;
                default:
                    number = -1;
                    break;
            }

            return number;
        }

        //Helper function to add a new member to the system
        public void addMember(string firstName, string lastName, string contactNumber, string pin)
        {
            Member member = new Member(firstName, lastName, contactNumber, pin);

            if (members.Select(x => $"{x.FirstName}{x.LastName}").ToArray().Contains(firstName + lastName)) 
            {
                Console.Write("\nThis member already exists. Press enter to return to the staff menu ");
                Console.ReadLine();

            }

            else
            {
                system.add(member);
                members.Add(member);
            }
        }

        //Helper function to add a new tool to the system
        public void toolCreator(string name, Boolean add)
        {
            Tool tool = new Tool(name);
            if (add) { system.add(tool); }
            else { system.delete(tool); }
        }

        //Helper function to add or decrease tool quantity
        public void toolCreator(string name, Boolean add, int quantity)
        {
            Tool tool = new Tool(name);
            if (add) { system.add(tool, quantity); }
            else { system.delete(tool, quantity); }
        }

        //Helper functin to borrow or return a tool
        public void borrow(string name, Boolean borrow)
        {
            Tool tool = new Tool(name);
            if (borrow) { system.borrowTool(currentMember, tool); }
            else { system.returnTool(currentMember, tool); }
        }

        //Main
        static void Main(string[] args)
        {
            //Add default member and tools for testing
            pg.addMember("Steve", "Rogers", "911 000", "1234");

            categoryIndex = 0;
            typeIndex = 0;
            pg.toolCreator("Large Line Trimmer", true);
            pg.toolCreator("Small Line Trimmer", true);

            typeIndex = 1;
            pg.toolCreator("Lawn Mower 9000", true);

            categoryIndex = 1;
            typeIndex = 0;
            pg.toolCreator("Chrome Floor Scraper", true);

            mainMenu();
        }
    }
}
