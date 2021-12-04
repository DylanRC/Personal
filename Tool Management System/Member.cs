using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CAB301_Assignment
{
    class Member : iMember, IComparable
    {
        private List<Tool> tools;
        private string firstName;
        private string lastName;
        private string contactNumber;
        private string pin;

        public Member(string firstName, string lastName, string contactNumber, string pin)
        {
            this.firstName = firstName;
            this.lastName = lastName;
            this.contactNumber = contactNumber;
            this.pin = pin;
            tools = new List<Tool>();
        }

        public string FirstName //get and set the first name of this member
        { 
            get { return firstName; } 
            set { firstName = value; }
        }

        public string LastName //get and set the last name of this member
        {
            get { return lastName; }
            set { lastName = value; }
        }

        public string ContactNumber //get and set the contact number of this member
        {
            get { return contactNumber; }
            set { contactNumber = value; }
        }

        public string PIN //get and set the password of this member
        {
            get { return pin; }
            set { pin = value; }
        }

        public string[] Tools //get a list of tools that this memebr is currently holding
        { 
            get { return tools.Select(x => x.Name).ToArray(); }
        }

        public void addTool(Tool aTool) //add a given tool to the list of tools that this member is currently holding
        {
            tools.Add(aTool);
        }

        public void deleteTool(Tool aTool) //delete a given tool from the list of tools that this member is currently holding
        {
            tools[int.Parse(aTool.Name) - 1].AvailableQuantity += 1;
            tools[int.Parse(aTool.Name) - 1].deleteBorrower(new Member(firstName, lastName, contactNumber, pin));
            tools.RemoveAt(int.Parse(aTool.Name) - 1);
        }

        public override string ToString() //return a string containing the first name, lastname, and contact phone number of this memeber
        {
            return $"{firstName},{lastName},{contactNumber}";
        }

        //Implementing the IComparable CompareTo method neccessary for the binary search tree to work
        public int CompareTo(object obj)
        {
            Member otherMember = obj as Member;

            int position = String.Compare(this.FirstName, otherMember.FirstName);

            if (position == 0)
            {
                position = String.Compare(this.LastName, otherMember.LastName);

                return position;
            }

            else
            {
                return position;
            }
        }
    }
}
