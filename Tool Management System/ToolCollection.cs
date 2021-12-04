using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CAB301_Assignment
{
    class ToolCollection
    {
        private int number;
        private Tool[][] tools = new Tool[6][];

        public ToolCollection()
        {
            number = 0;

            for (int i = 0; i < 6; i++)
            {
                tools[i] = new Tool[0];
            }
        }

        public int Number // get the number of the types of tools in the community library
        {
            get { return number; }
        }

        public void add(Tool aTool) //add a given tool to this tool collection
        {
            int noTools = tools[Program.typeIndex].Length;
            Array.Resize(ref tools[Program.typeIndex], noTools + 1);

            tools[Program.typeIndex][noTools] = aTool;

            number += 1;
        }

        //Delete a given tool from this tool collection. This removes a tool based on its index, which is retreived by passing the tools name as an integer.
        public void delete(Tool aTool)
        {
            tools[Program.typeIndex] = tools[Program.typeIndex].Where((val, idx) => idx != int.Parse(aTool.Name) - 1).ToArray();

            number -= 1;
        }

        public Boolean search(Tool aTool) //search a given tool in this tool collection. Return true if this tool is in the tool collection; return false otherwise
        {
            //Get the names of all of the tools present in the current tool type and perform a linear search
            if (tools[Program.typeIndex].Select(x => x.Name).ToArray().Contains(aTool.Name))
            {
                return true;
            }
            else { return false; }

        }

        public Tool[] toArray() // output the tools in this tool collection to an array of iTool
        {
            //Note: Set program.typeIndex to a negative number in order to get the whole Tool Collection as an array
            if (Program.typeIndex < 0)
            {
                return tools.SelectMany(a => a).ToArray();
            }

            else
            {
                return tools[Program.typeIndex];
            }

        }
    }
}
