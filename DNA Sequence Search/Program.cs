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
    
    Program which collects the command line arguments and parses them. 
    It does this by saving their values and throwing out any neccessary excpetions. 
    After the arguments have been parsed it calls the correct search method from the search class

    Initial argument must be a flag indicating the type of search

    Author Dylan Chalk 2019

    </summary> */
    class Program
    {
        /// <summary>
        /// Parses the arguments by storing them and responding with an 
        /// appropriate error messages if neccessary.
        /// 
        /// </summary>
        /// <param name="args">Arguments passed in from the command line</param>
        /// <returns>SearchDetails variables to be used throught the program</returns>
        public static SearchDetails parseArguments(string[] args)
        {
            //Checks if there are enough arguments to proceed with parsing
            if (args.Length < 3)
            {
                Console.WriteLine("Error, the correct number of arguments has not been provided.");
                return null;
            }

            //Instantiating the errors class
            Errors e = new Errors(args);

            //Instantiates the SearchDetails class as details
            SearchDetails details = new SearchDetails
            {
                inputFile = args[1]
            };

            //Checks if the input file is a fasta format
            if (e.incorrectFileFormat(details.inputFile, ".fasta")) return null;

            //Switch case which performs tasks based on the -levelN flag such as checking if the correct number of arguments has been provided
            switch (args[0])
            {
                case "-level1":
                   if (e.argsError(4)) return null;

                    //Parses the start line and number of sequences as ints and returns appropriate errors if neccessary
                    bool success = int.TryParse(args[2], out details.startLine);
                    if (success == false || details.startLine < 1)
                    {
                        Console.WriteLine("Error, the argument for start line, must be an integer greater than 0.");
                        return null;
                    }

                    if (details.startLine % 2 == 0)
                    {
                        Console.WriteLine("Error, the argument for start line must be an odd number.");
                        return null;
                    }

                    success = int.TryParse(args[3], out details.numSequences);
                    if (success == false || details.numSequences < 1)
                    {
                        Console.WriteLine("Error, the argument for the number of sequences must be an integer greater than 0.");
                        return null;
                    }

                    break;

                case "-level2":
                    //Check if the number of provided arguments is correct
                    if (e.argsError(3)) return null;

                    //Assigning values
                    details.id = args[2];

                    //Checks if the format of id is correct
                    if (details.id.StartsWith("NR_") == false || details.id.Length != 11)
                    {
                        Console.WriteLine("Error, the argument for sequence id is an invalid format.");
                        return null;
                    }
                    break;

                case "-level3":
                    //Checking if the number of provided arguments is correct
                    if (e.argsError(4)) return null;

                    //Assigning values
                    details.queryFile = args[2];
                    details.outputFile = args[3];

                    //Checking if the query file and output file are the correct format
                    if (e.incorrectFileFormat(details.queryFile, ".txt")) return null;
                    if (e.incorrectFileFormat(details.outputFile, ".txt")) return null;
                    break;

                case "-level4":
                    //Checking if the number of provided arguments is correct
                    if (e.argsError(5)) return null;

                    //Assigning values
                    details.indexFile = args[2];
                    details.queryFile = args[3];
                    details.outputFile = args[4];

                    //Checking if all of the index, query and output files are the correct format
                    if (e.incorrectFileFormat(details.indexFile, ".index")) return null;
                    if (e.incorrectFileFormat(details.queryFile, ".txt")) return null;
                    if (e.incorrectFileFormat(details.outputFile, ".txt")) return null;

                    break;

                case "-level5":
                    //Checking if the number of provided arguments is correct
                    if (e.argsError(3)) return null;

                    //Assigning value
                    details.id = args[2];

                    //Ensuring that the query sequence only contains the correct characters
                    if (!details.id.All(c => "GTCNA".Contains(c)))
                    {
                        Console.WriteLine("Error, your input sequence is invalid");
                        return null;
                    }
                    break;

                case "-level6":
                    //Checking if the number of provided arguments is correct
                    if (e.argsError(3)) return null;

                    //Assigning value
                    details.id = args[2];
                    break;

                case "-level7":
                    //Checking if the number if provided arguments is correct
                    if (e.argsError(3)) return null;

                    details.id = args[2];

                    if (!details.id.All(c => "GTCNA*".Contains(c)))
                    {
                        Console.WriteLine("Error, your input sequence is invalid");
                        return null;
                    }

                    //Adds a '.' to all wildcards so that they are 'greedy'
                    details.id = details.id.Replace("*", ".*");
                    break;
                
                    //If the flag is not part of the switch case then error
                default:
                    Console.WriteLine("Error, flag is invalid");
                    return null;
            }
            return details;
        }

        
        static void Main(string[] args)
        {
            //Instantiating variables from the details class using the parseArguments function
            SearchDetails details = parseArguments(args);

            if (details != null)
            {
                Search.details = details;

                //Calling the requested search
                switch (args[0])
                {
                    case "-level1":
                        Search.Level1();
                        break;

                    case "-level2":
                        Search.Level2();
                        break;

                    case "-level3":
                        Search.Level3();
                        break;

                    case "-level4":
                        Search.Level4();
                        break;

                    case "-level5":
                        Search.Level5();
                        break;

                    case "-level6":
                        Search.Level6();
                        break;

                    case "-level7":
                        Search.Level7();
                        break;
                }
            }
        }
    }
}
