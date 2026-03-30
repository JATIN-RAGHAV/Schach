package main

import "fmt"

// Pieces to Symbols
var piecesToSymbols = map[piece]string{
    WP: "♟",
    WN: "♞",
    WB: "♝",
    WR: "♜",
    WQ: "♛",
    WK: "♚",
    BP: "♙",
    BN: "♘",
    BB: "♗",
    BR: "♖",
    BQ: "♕",
    BK: "♔",
	NN: " ",
}

func printBoard(board Board,color color)(boardString string){
	if(color == White){
		for i := len(board)-1 ; i>=0 ;i--{
			boardString += fmt.Sprintf("%d ",i+1);
			for j := range len(board){
				symbol := piecesToSymbols[board[i][j]];
				boardString += fmt.Sprintf("%s ",symbol);
			}
			boardString += "\n";
		}
		boardString += "  a b c d e f g h\n";
	}else{
		for i := range len(board){
			boardString += fmt.Sprintf("%d ",i+1);
			for j := len(board[i])-1 ; j>=0; j--{
				symbol := piecesToSymbols[board[i][j]];
				boardString += fmt.Sprintf("%s ",symbol);
			}
			boardString += "\n";
		}
		boardString += "  h g f e d c b a\n";
	}
	return 
}
