using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Text.RegularExpressions;

namespace Assignment1
{
    /* <summary>

    Holds commonly occuring errors, however more specific errors that occur only once remain embedded

    Author Dylan Chalk 2019

    </summary> */
    class Errors
    {
        private string[] _args;

        //Default Constructor
        public Errors() {}

        //Constructor for ParseArguments
        public Errors(string[] args)
        {
            _args = args;
        }

        /// <summary>
        /// Throws an error if the number of arguments is incorrect
        /// 
        /// </summary>
        /// <returns>Bool based on if an error has occured</returns>
        public bool argsError(int numArgs)
        {
            if (_args.Length != numArgs)
            {
                Console.WriteLine("Error, the correct number of arguments has not been provided.");
                return true;
            }

            return false;
        }

        /// <summary>
        /// Throws an error if a sequence couldn't be found
        /// 
        /// </summary>
        /// <returns>Void</returns>
        public void notFoundError(int count, string name = "")
        {
            if (count < 1)
            {
                Console.WriteLine("Error, sequence id from query '{0}' could not be found", name);
            }
        }

        /// <summary>
        /// Throws an error if a file is not formatted like the second argument
        /// 
        /// </summary>
        /// <returns>Bool based on if an error has occured</returns>
        public bool incorrectFileFormat(string fileName, string format)
        {
            if (fileName.EndsWith(format) == false)
            {
                string name = fileName;
                if (fileName.Contains(".")) name = fileName.Remove(fileName.IndexOf('.'));

                Console.WriteLine("Error, {0} must be of format '{1}'", name, format);
                return true;
            }

            return false;
        }
    }
}
