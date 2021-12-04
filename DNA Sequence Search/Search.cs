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

    Holds all of the variables for the command line arguments that each search function uses

    Author Dylan Chalk 2019

    </summary> */
    public class SearchDetails
    {
        public string inputFile;    //Contains the name of the input file which will be read
        public string id;           //Contains the name of the query
        public string queryFile;    //Contains the name of the query file which contains the search queries
        public string outputFile;   //Contains the name of the file which will output the results to
        public string indexFile;    //Contains the name of the file which contains the index for the input file
        public string searchType;   //Contains the level flag which determines which search method will be used
        public int startLine;       //Contains a number which determines which line the level one search will start from
        public int numSequences;    //Contains a number which determines how many sequences to display after the start line
    }

    /* <summary>
     
    Holds all of the different search functions which each perform a
    different search on the fasta file based on the argument parsed in the Program class.

    Author Dylan Chalk 2019
     
     </summary> */
    class Search
    {
        //Instantiating SearchDetails as details
        public static SearchDetails details;

        //Instantiating Errors as e
        public static Errors e = new Errors();

        /// <summary>
        ///  Performs the "-level1" search by searching for a specified number 
        ///  of sequences from a certain line.
        /// 
        /// </summary>
        /// <returns>Void</returns>
        public static void Level1()
        {
            int count = 0;
            int numLines = 0;


            //Tries to perform the search and catches any exceptions that may arrise from an incorrect file name
            try
            {
                foreach (string line in File.ReadLines(details.inputFile))
                {
                    count++;
                    if (count >= details.startLine)
                    {
                        numLines++;
                        if (numLines > (details.numSequences * 2)) break;
                        Console.WriteLine(line);
                    }
                }
            }
            catch (FileNotFoundException)
            {
                Console.WriteLine("Input file {0}, could not be found", details.inputFile);
            }

            if (numLines < 1)
            {
                Console.WriteLine("Error, the specified starting line is greater than the file line count.");
            }

            //This is only a warning and will not prevent the function from running. It displays at the end of the console
            else if ((details.numSequences * 2) + details.startLine > count)
            {
                Console.WriteLine("\nWarning, the requested number of sequences was greater than what was left in the file, only the remaining sequences will be displayed.");
            }
        }

        /// <summary>
        ///  Performs the "-level2" search by searching for the specified 
        ///  sequence id and outputting it to the console.
        /// 
        /// </summary>
        /// <returns>Void</returns>
        public static void Level2()
        {
            int count = 0;
            bool found = false;

            try
            {
                //Reading all of the lines and saving the ones that meet certain conditions, i.e. the sequence id
                foreach (string line in File.ReadLines(details.inputFile))
                {
                    //If the line has the current id
                    if (line.Contains(details.id))
                    {
                        Console.WriteLine(line);
                        count++;
                        found = true;
                    }

                    else if (found == true)
                    {
                        Console.WriteLine(line);
                        break;
                    }
                }
            }

            catch (FileNotFoundException)
            {
                Console.WriteLine("Input file {0}, could not be found", details.inputFile);
            }

            //Errors if the provided sequence id was not found
            e.notFoundError(count, details.id);
        }

        /// <summary>
        ///  Performs the "-level3" search by searching for sequence ids 
        ///  specified in the query file and outputs it to a result file.
        /// 
        /// </summary>
        /// <returns>Void</returns>
        public static void Level3()
        {
            bool found = false;
            List<string> foundSequences = new List<string> { };
            List<string> querySequences = new List<string> { };

            try
            {
                //Creates the output file
                File.Create(details.outputFile).Dispose();

                //Adds the querys to a list
                foreach (string query in File.ReadLines(details.queryFile))
                {
                    querySequences.Add(query);
                }

                using (StreamWriter outputFile = new StreamWriter(details.outputFile))
                {
                    //Sequentially searches the input file but checking if it matches every element in the query file
                    foreach (string line in File.ReadLines(details.inputFile))
                    {
                        //Checks if a sequence id was found and appends the sequence which follows it to the output file
                        if (found == true)
                        {
                            outputFile.WriteLine(line);
                            found = false;
                        }

                        //Appends the sequence id line to the output file
                        foreach (string item in querySequences)
                        {
                            if (line.Contains(item))
                            {
                                outputFile.WriteLine(line);
                                foundSequences.Add(item);
                                found = true;
                            }
                        }
                    }
                }
            }

            catch (FileNotFoundException ex)
            {
                Console.WriteLine("Error, {0} could not be found", ex.FileName);
            }

            foreach (string element in querySequences)
            {
                if (foundSequences.Contains(element) == false)
                {
                    Console.WriteLine("Error, sequence {0} not found", element);
                }
            }
        }

        /// <summary>
        ///  Performs the "-level4" search by searching for indexed sequence ids 
        ///  specified in the query file and outputs it to a result file. 
        /// 
        /// </summary>
        /// <returns>Void</returns>
        public static void Level4()
        {
            List<string> foundSequences = new List<string> { };
            //List<string> querySequences = new List<string> { };

            try
            {
                //Creates the output file
                File.Create(details.outputFile).Dispose();

                //Opening the input for for reading
                FileStream inputStream = new FileStream(details.inputFile, FileMode.Open);
                StreamReader reader = new StreamReader(inputStream);

                //Adds the querys to a list
                string[] querySequences = File.ReadAllLines(details.queryFile);

                //Adds the index file to a list
                string[] indexContent = File.ReadAllLines(details.indexFile);

                //Wiriting the found sequences into a results file
                using (StreamWriter outputFile = new StreamWriter(details.outputFile))
                {
                    foreach (string item in querySequences)
                    {
                        foreach (string index in indexContent)
                        {
                            reader.DiscardBufferedData();

                            if (index.Contains(item))
                            {
                                //Seeking to the byte offset of the query'ed sequence id, extracting it from the line 
                                //and then adding it and the sequence below it to the output file
                                int offset = int.Parse(index.Split(' ')[1]);
                                inputStream.Seek(offset, SeekOrigin.Begin);

                                string sequenceLine = reader.ReadLine();
                                outputFile.WriteLine(sequenceLine.Split('>')[1]);
                                outputFile.WriteLine(reader.ReadLine());

                                //inputStream.Seek(sequenceLine.Length + 1, SeekOrigin.Current);
                                //outputFile.WriteLine(reader.ReadLine());
                                foundSequences.Add(item);
                            }
                        }
                    }
                }

                inputStream.Close();

                //Checks which sequences were found
                foreach (string element in querySequences)
                {
                    if (foundSequences.Contains(element) == false)
                    {
                        Console.WriteLine("Error, sequence {0} not found", element);
                    }
                }
            }

            catch (FileNotFoundException ex)
            {
                Console.WriteLine("Error, {0} could not be found", ex.FileName);
            }
        }


        /// <summary>
        ///  Performs the "level5" search by searching for an exact match
        ///  of a DNA query string.
        /// 
        /// </summary>
        /// <returns>Void</returns>
        public static void Level5()
        {
            int count = 0;
            List<string> currentID = new List<string> { };

            //Instantiating Regex to find all sequence IDs
            Regex regID = new Regex(@"NR_[0-9]*[.][1-9]\b");

            try
            {
                foreach (string line in File.ReadLines(details.inputFile))
                {
                    if (line.StartsWith(">"))
                    {
                        currentID.Clear();

                        foreach (Match matches in regID.Matches(line))
                        {
                            currentID.Add(matches.Value);
                        }
                    }

                    //If the line contains the query write to console the current id
                    else if (line.Contains(details.id))
                    {
                        currentID.ForEach(Console.WriteLine);
                        count++;
                    }
                }
            }

            catch (FileNotFoundException)
            {
                Console.WriteLine("Input file {0}, could not be found", details.inputFile);
            }
            
            //Throwing an error if the sequence id couldn't be found from the query
            e.notFoundError(count, details.id);
        }

        /// <summary>
        ///  Performs the "level6" search by searching for sequence 
        ///  meta-data containing a given word.
        /// 
        /// </summary>
        /// <returns>Void</returns>
        public static void Level6()
        {
            int count = 0;

            try
            {
                foreach (string line in File.ReadLines(details.inputFile))
                {
                    if (line.StartsWith(">"))
                    {
                        string[] sequenceIDs = line.Split('>');

                        foreach (string sequence in sequenceIDs)
                        {
                            if (sequence.Contains(details.id))
                            {
                                Console.WriteLine(sequence.Substring(0, 11));
                                count++;
                            }
                        }
                    }
                }

                //Throwing an error if the sequence id could not be found
                e.notFoundError(count, details.id);
            }

            catch (FileNotFoundException)
            {
                Console.WriteLine("Input file {0}, could not be found", details.inputFile);
            }
        }

        /// <summary>
        ///  Performs the "level7" search by searching for a match of a 
        ///  DNA query string containing wildcards.
        /// 
        /// </summary>
        /// <returns>Void</returns>
        public static void Level7()
        {
            int count = 0;
            List<string> currentID = new List<string> { };

            //Instantiating Regex to find a sequence match and sequence ID's
            Regex regSequence = new Regex(details.id);
            Regex regID = new Regex(@"NR_[0-9]*[.][1-9]\b");

            try
            {
                foreach (string line in File.ReadLines(details.inputFile))
                {
                    Match match = regSequence.Match(line);

                    if (line.StartsWith(">"))
                    {
                        currentID.Clear();

                        foreach (Match matches in regID.Matches(line))
                        {
                            currentID.Add(matches.Value);
                        }
                    }

                    else if (match.Success)
                    {
                        currentID.ForEach(Console.WriteLine);
                        count++;
                    }
                }
            }

            catch (FileNotFoundException)
            {
                Console.WriteLine("Input file {0}, could not be found", details.inputFile);
            }

            //Throwing an error if the sequence id could not be found from the query
            e.notFoundError(count, details.id);
        }
    }    
}
