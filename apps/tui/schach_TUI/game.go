package schach_TUI;

func initBoard() (board Board){
	// Make all the pieces null
	for i := range 8{ 
		for j := range 8{
			board[i][j] = NN;
		}
	}

	// Set the pawns
	for i := range 8{
		board[1][i] = WP;
		board[6][i] = BP;
	}

	// Set the rest of the pieces
	board[0][0] = WR;
    board[0][1] = WN;
    board[0][2] = WB;
    board[0][3] = WQ;
    board[0][4] = WK;
    board[0][5] = WB;
    board[0][6] = WN;
    board[0][7] = WR;
    board[7][0] = BR;
    board[7][1] = BN;
    board[7][2] = BB;
    board[7][3] = BQ;
    board[7][4] = BK;
    board[7][5] = BB;
    board[7][6] = BN;
    board[7][7] = BR;
    return
}

func initGameStruct(m model) (gameStruct gameStruct){
	gameStruct.board = initBoard();
	
	switch m.game_types[m.game_type_selected]{
		case Rapid:
			gameStruct.whiteTimeLeft = 10 * 60 * 1000;
			gameStruct.blackTimeLeft= 10 * 60 * 1000;
		case Blitz:
            gameStruct.whiteTimeLeft = 3 * 60 * 1000;
            gameStruct.blackTimeLeft= 3 * 60 * 1000;
        case Bullet:
            gameStruct.whiteTimeLeft = 1 * 60 * 1000;
            gameStruct.blackTimeLeft= 1 * 60 * 1000;
	}

	gameStruct.moveNumber = 0;
	gameStruct.moves = make([]string, 0);

	return
}
