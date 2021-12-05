using System;
using System.Collections.Generic;
using System.Linq;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;

//Dylan Chalk - 2021

namespace GUI
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        private List<string> equation;

        public MainWindow()
        {
            InitializeComponent();
            equation = new List<string>();
            equation.Add("");
        }

        /// <summary>
        /// On click function responsible for handling all numerical buttons as well as
        /// the decimal place key.
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void NumberKeypad(object sender, RoutedEventArgs e)
        {
            if (equation.Count % 2 == 0) { equation.Add(""); }
            string key = (string)(sender as Button).Content;

            if (key == ".")
            {
                if (equation[equation.Count - 1].Contains(key)) { return; }
                if (string.IsNullOrEmpty(equation[equation.Count - 1])) { key = "0."; }
            }

            equation[equation.Count - 1] += key;
            Display.Text = string.Join(" ", equation);
        }

        /// <summary>
        /// On click function responsible for handling all mathematical operands such as
        /// addition, subtraction, multiplication, division, etc cetera.
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void OperatorKeypad(object sender, RoutedEventArgs e)
        {
            string key = (string)(sender as Button).Content;

            if (equation.Count % 2 == 1) 
            {
                if (string.IsNullOrEmpty(equation[equation.Count - 1])) { equation[equation.Count - 1] = "0"; }
                equation.Add(key);
            }
            else { equation[equation.Count - 1] = key; }

            Display.Text = string.Join(" ", equation);
        }

        /// <summary>
        /// On click function responsible for handling all operations that be be considered functions
        /// such as square root, clear, delete, et cetera. Simply add to the switch statement to add
        /// functionality for a new function button.
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void FunctionKeypad(object sender, RoutedEventArgs e)
        {
            string key = (string)(sender as Button).Content;

            switch (key)
            {
                case "C":
                    equation.Clear();
                    equation.Add("");
                    break;

                case "CE":
                    equation[equation.Count - 1] = "";
                    break;

                case "Del":
                    if (equation.Count % 2 == 1 && equation.Any() && !string.IsNullOrEmpty(equation[equation.Count - 1]))
                    {
                        equation[equation.Count - 1] = equation[equation.Count - 1].Remove(equation[equation.Count - 1].Length - 1);
                    }
                    break;

                case "√":
                    if (string.IsNullOrEmpty(equation[equation.Count - 1]) || equation.Count % 2 == 0) { return; }
                    else { equation[equation.Count - 1] = Math.Sqrt(double.Parse(equation[equation.Count - 1])).ToString(); }
                    break;

                case "±":
                    if (string.IsNullOrEmpty(equation[equation.Count - 1]) || equation[equation.Count - 1].Contains("-") || equation.Count % 2 == 0) { return; }
                    else { equation[equation.Count - 1] = "-" + equation[equation.Count - 1]; }
                    break;
            }

            Display.Text = string.Join(" ", equation);
        }

        /// <summary>
        /// Use order of operations to simplify equation variable into numbers rather than operations.
        /// For example: (5, /, 5) would be replaced by (25).
        /// </summary>
        /// <param name="operation"></param>
        /// <param name="index"></param>
        private void SimplifyOperation(string operation, int index)
        {
            double value;

            if (operation == "^") value = Math.Pow(double.Parse(equation[index - 1]), double.Parse(equation[index + 1]));
            else if (operation == "/") value = double.Parse(equation[index - 1]) / double.Parse(equation[index + 1]);
            else if (operation == "%") value = double.Parse(equation[index - 1]) % double.Parse(equation[index + 1]);
            else value = double.Parse(equation[index - 1]) * double.Parse(equation[index + 1]);

            equation.RemoveAt(index + 1);
            equation.RemoveAt(index);
            equation.RemoveAt(index - 1);
            equation.Insert(index - 1, value.ToString());
        }

        /// <summary>
        /// Calculate the final result of the equation, calls SimplifyOperation as neccessary.
        /// </summary>
        /// <param name="equation"></param>
        /// <returns>The final value of the equation stored as a double</returns>
        private double Calculate(List<string> equation)
        {
            double result;
            int index;

            //Simplify all of the exponents
            while (true)
            {
                index = equation.IndexOf("^");

                if (index >= 0)
                {
                    SimplifyOperation("^", index);
                }
                else break;
            }

            //Simplify the division, multiplication and modulo operations from left to right
            while (true)
            {
                //Get the smallest non negative value and then break once all of the operations have been satisfied
                index = new[] { (byte)equation.IndexOf("/"), (byte)equation.IndexOf("×"), (byte)equation.IndexOf("%") }.Min();
                if (index == 255) break;

                SimplifyOperation((string)equation[index], index);
            }

            //Iterate through the list and calculate the final sum
            result = double.Parse(equation[0]);
            if (equation.Count > 2)
            {
                for (int i = 0; i < (equation.Count / 2); i++)
                {
                    if (equation[i * 2 + 1] == "+")
                    {
                        result += double.Parse(equation[i * 2 + 2]);
                    }

                    else
                    {
                        result -= double.Parse(equation[i * 2 + 2]);
                    }
                }
            }

            return result;
        }

        /// <summary>
        /// OnClick function responsible for the calculating the result of the equation when the equals
        /// button is clicked.
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void EqualsKeypad(object sender, RoutedEventArgs e)
        {
            //Error handling
            if (equation.Count < 2) { return; }
            if (equation.Count % 2 == 0) { equation.Add(equation[equation.Count - 2]); } //Copies the last number over if no number is given after an operator

            //Calculate the final result and display it
            string result = Calculate(equation).ToString();
            Display.Text = result;

            equation.Clear();
            equation.Add(result);
        }

        /// <summary>
        /// Maps keyboard presses to buttons on the calculator
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void OnKeyDownHandler(object sender, KeyEventArgs e)
        {
            switch(e.Key)
            {
                case Key.D1:
                case Key.NumPad1:
                     One.RaiseEvent(new RoutedEventArgs(Button.ClickEvent));
                    break;
                case Key.D2:
                case Key.NumPad2:
                    Two.RaiseEvent(new RoutedEventArgs(Button.ClickEvent));
                    break;
                case Key.D3:
                case Key.NumPad3:
                    Three.RaiseEvent(new RoutedEventArgs(Button.ClickEvent));
                    break;
                case Key.D4:
                case Key.NumPad4:
                    Four.RaiseEvent(new RoutedEventArgs(Button.ClickEvent));
                    break;
                case Key.D5:
                case Key.NumPad5:
                    if (Keyboard.IsKeyDown(Key.LeftShift)) { Remainder.RaiseEvent(new RoutedEventArgs(Button.ClickEvent)); }
                    else { Five.RaiseEvent(new RoutedEventArgs(Button.ClickEvent)); }
                    break;
                case Key.D6:
                case Key.NumPad6:
                    if (Keyboard.IsKeyDown(Key.LeftShift)) { Exponent.RaiseEvent(new RoutedEventArgs(Button.ClickEvent)); }
                    else { Six.RaiseEvent(new RoutedEventArgs(Button.ClickEvent)); }
                    break;
                case Key.D7:
                case Key.NumPad7:
                    Seven.RaiseEvent(new RoutedEventArgs(Button.ClickEvent));
                    break;
                case Key.D8:
                case Key.NumPad8:
                    Eight.RaiseEvent(new RoutedEventArgs(Button.ClickEvent));
                    break;
                case Key.D9:
                case Key.NumPad9:
                    Nine.RaiseEvent(new RoutedEventArgs(Button.ClickEvent));
                    break;
                case Key.D0:
                case Key.NumPad0:
                    Zero.RaiseEvent(new RoutedEventArgs(Button.ClickEvent));
                    break;
                case Key.Divide:
                    Divide.RaiseEvent(new RoutedEventArgs(Button.ClickEvent));
                    break;
                case Key.Multiply:
                    Multiply.RaiseEvent(new RoutedEventArgs(Button.ClickEvent));
                    break;
                case Key.Enter:
                    Equals.RaiseEvent(new RoutedEventArgs(Button.ClickEvent));
                    break;
                case Key.Add:
                case Key.OemPlus:
                    if (e.Key == Key.Add || Keyboard.IsKeyDown(Key.LeftShift)) { Add.RaiseEvent(new RoutedEventArgs(Button.ClickEvent)); }
                    break;
                case Key.Subtract:
                    Subtract.RaiseEvent(new RoutedEventArgs(Button.ClickEvent));
                    break;
                case Key.OemPeriod:
                    Decimal.RaiseEvent(new RoutedEventArgs(Button.ClickEvent));
                    break;
                case Key.Delete:
                case Key.Back:
                    Delete.RaiseEvent(new RoutedEventArgs(Button.ClickEvent));
                    break;
            }
        }
    }
}