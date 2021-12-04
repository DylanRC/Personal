import os
clear = lambda: os.system('cls')

class TicTacToe:
    def __init__(self):
        self.board = list("- - -\n" * 3)
        self.taken_positions = []

    
    def check_state(self, symbol):
        """
        Checks the game state to determine if a given players has won

        param: The symbol to check a victory for
        return: Whether the game has been won or not
        """ 
        #Check the center first as this is most commonly played and will rule out the most
        if self.board[8] == symbol:
            for x in range(4):  
                if (self.board[x * 2] == symbol and self.board[16 - x * 2] == symbol):
                    return True
        #Check the top left corner next
        elif self.board[0] == symbol:
            if ((self.board[2] == symbol and self.board[4] == symbol) or
                (self.board[6] == symbol and self.board[12])):
                return True
        #Finally, check the bottom right corner
        elif self.board[16] == symbol:
            if ((self.board[14] == symbol and self.board[12] == symbol) or
                (self.board[10] == symbol and self.board[4])):
                return True

        return False

    def get_input(self, inputMessage):
        """
        Gets user input

        param: Input description message
        return: The value of the user input
        """ 
        while True:
            value = input(inputMessage)
            if value.isdigit() and (2 >= int(value) >= 0):
                return value

    def end_screen(self, message):
        """
        Displays the end game screen and resets game state

        param: End game message to be displayed
        return: none
        """ 
        clear()
        print(message)
        self.__init__()
        input("Press enter to continue")


    def game_loop(self, turn = True):
        """
        Runs the main game logic, including displaying the game board

        param: Whose turn it currently is. True for 'X', False for 'O'
        return: none
        """ 
        symbol = "X" if turn else "O"
        
        clear()
        print("".join(self.board))

        #Get selected row/column and check if it is 0 to 2
        while True:
            row = self.get_input("Row (0, 1, 2): ")
            column = self.get_input("Column (0, 1, 2): ")

            if not (row + column) in self.taken_positions:
                break
            print("This position has already been selected, try again")

        self.taken_positions.append(row + column)
        self.board[((int(column) * 2) + (int(row) * 6))] = symbol

        #Check the board state (only after 5+ positions have been reached) 
        if len(self.taken_positions) >= 5:
            if self.check_state(symbol):
                self.end_screen(f"Player '{symbol}' won")
            elif len(self.taken_positions) == 9:
                self.end_screen("Game tied")
                              
        self.game_loop(not turn)


#Play the game
Game = TicTacToe()
Game.game_loop()
