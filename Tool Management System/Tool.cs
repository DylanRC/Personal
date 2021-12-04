using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CAB301_Assignment
{
    class Tool : iTool
    {
        private string name;
        private int quantity;
        private int availableQuantity;
        private int noBorrowings;
        private MemberCollection borrowers = new MemberCollection();


        //Constructor
        public Tool(string name)
        {
            this.name = name;
            quantity = 1;
            availableQuantity = 1;
            noBorrowings = 0;
        }

        public string Name
        {
            get { return name; }
            set { name = value; }
        }

        public int Quantity //get and set the quantity of this tool
        {
            get { return quantity; }
            set { quantity = value; }
        }

        public int AvailableQuantity //get and set the quantity of this tool currently available to lend
        {
            get { return availableQuantity; }
            set { availableQuantity = value; }
        }

        public int NoBorrowings //get and set the number of times that this tool has been borrowed
        {
            get { return noBorrowings; }
            set { noBorrowings = value; }
        }

        public MemberCollection GetBorrowers  //get all the members who are currently holding this tool
        {
            get { return borrowers; }
        }

        public void addBorrower(Member aMember) //add a member to the borrower list
        {
            borrowers.add(aMember);
        }

        public void deleteBorrower(Member aMember) //delte a member from the borrower list
        {
            borrowers.delete(aMember);
        }

        public override string ToString()
        {
            return $"{name} Q:{quantity} AQ:{availableQuantity}";
        }
    }
}
