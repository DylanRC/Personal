using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CAB301_Assignment
{
    class ToolLibrarySystem : iToolLibrarySystem
    {
        //Instantiate a ToolCollection for each tool category
        private ToolCollection GardeningTools = new ToolCollection();
        private ToolCollection FlooringTools = new ToolCollection();
        private ToolCollection FencingTools = new ToolCollection();
        private ToolCollection MeasuringTools = new ToolCollection();
        private ToolCollection CleaningTools = new ToolCollection();
        private ToolCollection PaintingTools = new ToolCollection();
        private ToolCollection ElectronicTools = new ToolCollection();
        private ToolCollection ElectricityTools = new ToolCollection();
        private ToolCollection AutomotiveTools = new ToolCollection();
        private ToolCollection[] tools; //Array to prevent the need for a switch statement when selecting a ToolCollection object

        //Store the top three values
        private List<Tool> top3 = new List<Tool>();

        //Instantiate MemberCollection
        private MemberCollection members = new MemberCollection();

        //Constructor
        public ToolLibrarySystem()
        {
            tools = new ToolCollection[] {
                GardeningTools,
                FlooringTools,
                FencingTools,
                MeasuringTools,
                CleaningTools,
                PaintingTools,
                ElectronicTools,
                ElectricityTools,
                AutomotiveTools
            };
        }

        //Add a new tool to the system
        public void add(Tool aTool)
        {
            if (!tools[Program.categoryIndex].search(aTool))
            {
                tools[Program.categoryIndex].add(aTool);
                Console.Write("\nTool was added successfully. Press enter to return to the tool menu ");
            }

            else
            {
                Console.Write("\nThis tool already exists. Press enter to return to the tool menu ");
            }

            Console.ReadLine();
        }

        //Add new pieces of an existing tool to the system
        public void add(Tool aTool, int quantity)
        {
            Tool[] toolRef = tools[Program.categoryIndex].toArray();

            if (int.Parse(aTool.Name) > toolRef.Length)
            {
                Console.Write("\nNo tool exists at the provided index. Press enter to return to the tool menu ");
            }

            else
            {
                aTool.Quantity = quantity;

                toolRef[int.Parse(aTool.Name) - 1].AvailableQuantity += aTool.Quantity;
                toolRef[int.Parse(aTool.Name) - 1].Quantity += aTool.Quantity;

                Console.Write("\nTool quantity was successfuly increased. Press enter to return to the tool menu ");
            }

            Console.ReadLine();
        }

        //Delete a given tool from the system. This method is unused as there is no reason to completely remove a tool from the system.
        public void delete(Tool aTool)
        {
            if (int.Parse(aTool.Name) > tools[Program.categoryIndex].toArray().Length)
            {
                Console.Write("\nNo tool exists at the provided index. Press enter to return to the tool menu ");
            }

            else
            {
                tools[Program.categoryIndex].delete(aTool);

                Console.Write("\nTool deleted successfully ");
            }

            Console.ReadLine();
        }

        //Remove some pieces of a tool from the system
        public void delete(Tool aTool, int quantity)
        {
            Tool[] toolRef = tools[Program.categoryIndex].toArray();

            if (int.Parse(aTool.Name) > toolRef.Length)
            {
                Console.Write("\nNo tool exists at the provided index. Press enter to return to the tool menu ");
            }

            else
            {
                //If there aren't enough available tools to remove, send an error message and allow them to return to the tool menu
                if (toolRef.Select(x => x.AvailableQuantity).ToArray()[int.Parse(aTool.Name) - 1] < quantity)
                {
                    Console.Write("\nYou cannot remove a quantity larger than there are available. Press enter to return to the tool menu ");
                }

                else
                {
                    aTool.Quantity = quantity;

                    toolRef[int.Parse(aTool.Name) - 1].AvailableQuantity -= aTool.Quantity;
                    toolRef[int.Parse(aTool.Name) - 1].Quantity -= aTool.Quantity;

                    Console.Write("\nTool quantity was successfuly decreased. Press enter to return to the tool menu ");
                }
            }

            Console.ReadLine();
        }

        //Add a new memeber to the system
        public void add(Member aMember)
        {
            if (!members.search(aMember))
            {
                members.add(aMember);
                Console.Write("\nMember was added successfully. Press enter to return to the staff menu ");
            }

            else
            {
                Console.Write("\nThis member already exists. Press enter to return to the staff menu ");
            }

            Console.ReadLine();
        }

        //Delete a member from the system
        public void delete(Member aMember)
        {
            if (members.search(aMember))
            {
                if (aMember.Tools.Length > 0)
                {
                    Console.Write("\nYou cannot remove a member who is currently borrowing a tool. Press enter to return to the staff menu ");
                }

                else
                {
                    members.delete(aMember);
                    Console.Write("\nMember was successfully deleted. Press enter to return to the staff menu ");
                }
            }

            else
            {
                Console.Write("\nNo members exist at the provided index. Press enter to return to the staff menu ");
            }

            Console.ReadLine();
        }

        //Given a member, display all the tools that the member are currently renting
        public void displayBorrowingTools(Member aMember)
        {
            Program.menuGenerator("Rented Tools", aMember.Tools, "Return to tool menu");
        }

        //Display all the tools of a tool type selected by a member
        public void displayTools(string aToolType)
        {
            //Generate the menu based on the tool names
            Program.menuGenerator(aToolType, tools[Program.categoryIndex].toArray().Select(x => x.ToString()).ToArray(), "Return to staff menu");
        }

        //A member borrows a tool from the tool library
        public void borrowTool(Member aMember, Tool aTool)
        {
            Tool[] toolRef = tools[Program.categoryIndex].toArray();

            if (int.Parse(aTool.Name) > toolRef.Length)
            {
                Console.WriteLine("No tool exists at the provided index. Press enter to return to the tool menu");
            }

            else if (aMember.Tools.Length >= 3)
            {
                Console.WriteLine("You cannot borrow more than 3 tools at a time. Press enter to return to the tool menu");
            }

            else if (toolRef[int.Parse(aTool.Name) - 1].AvailableQuantity < 1)
            {
                Console.WriteLine("This tool is currently not in stock. Press enter to return to the tool menu");
            }

            else if (aMember.Tools.Contains(toolRef[int.Parse(aTool.Name) - 1].Name))
            {
                Console.WriteLine("You cannot borrow the same tool again. Press enter to return to the tool menu");
            }

            else
            {
                aMember.addTool(toolRef[int.Parse(aTool.Name) - 1]);
                toolRef[int.Parse(aTool.Name) - 1].AvailableQuantity -= 1;
                toolRef[int.Parse(aTool.Name) - 1].NoBorrowings += 1;
                toolRef[int.Parse(aTool.Name) - 1].addBorrower(aMember);

                //When a tool is borrowed check its noBorrowed against the current top3
                checkTop3(toolRef[int.Parse(aTool.Name) - 1]);

                Console.WriteLine("Tool successfuly borrowed. Press enter to return to the tool menu");
            }

            Console.ReadLine();
        }

        //A member returns a tool to the tool library
        public void returnTool(Member aMember, Tool aTool)
        {

            if (int.Parse(aTool.Name) > aMember.Tools.Length)
            {
                Console.WriteLine("No tool exists at the provided index. Press enter to return to the tool menu");
            }

            else
            {
                aMember.deleteTool(aTool);

                Console.WriteLine("Tool successfuly returned. Press enter to return to the tool menu");
            }

            Console.ReadLine();
        }

        public string[] listTools(Member aMember) //get a list of tools that are currently held by a given member
        {
            return aMember.Tools;
        }

        //Display top three most frequently borrowed tools by the members in the descending order by the number of times each tool has been borrowed.
        public void displayTopThree()
        {
            Program.menuGenerator("Top 3 Borrowed Tools", top3.Count == 0 ? new string[] { "Currently no tools have been borrowed" } : top3.Select(x => x.Name).ToArray(), "Return to member menu");

            Console.Write("\nPress enter to return to the member menu");
            Console.ReadLine();
             
        }

        //Helper function to check if the current tools have been borrowed more times than the current top3;
        private void checkTop3(Tool aTool)
        {
            if (top3.Select(x => x.Name).Contains(aTool.Name))
            {
                if (top3.Count > 1)
                {
                    //Rearrange the first two
                    if (top3[0].NoBorrowings < top3[1].NoBorrowings)
                    {
                        Tool temp = top3[0];
                        top3[0] = top3[1];
                        top3[1] = temp;
                    }

                    //Sort including the third element if it is there
                    if (top3.Count == 3)
                    {
                        if (top3[1].NoBorrowings < top3[2].NoBorrowings)
                        {
                            Tool temp = top3[1];
                            top3[1] = top3[2];
                            top3[2] = temp;
                        }

                        if (top3[0].NoBorrowings < top3[1].NoBorrowings)
                        {
                            Tool temp = top3[0];
                            top3[0] = top3[1];
                            top3[1] = temp;
                        }
                    }
                }   
            }

            //If the list isn't full then we can just fill empty spots as a tool can only be borrowed one time before this function is called
            else if (top3.Count < 3) { top3.Add(aTool); }

            //If the element has a number of borrowings greater than the minimum, determine where to insert it
            else if (aTool.NoBorrowings > top3[2].NoBorrowings) //Borrowed more than the least borrowed in top 3
            {
                if (aTool.NoBorrowings <= top3[1].NoBorrowings) { top3[2] = aTool; } //Borrowed more than least borrowed but less than second
                else if (aTool.NoBorrowings <= top3[0].NoBorrowings) //Borrowed more than second but not third
                {
                    top3[2] = top3[1];
                    top3[1] = aTool;
                }
                else //borrowed more than third
                {
                    top3[2] = top3[1];
                    top3[1] = top3[0];
                    top3[0] = aTool;
                } 
            }
        }
    }
}
