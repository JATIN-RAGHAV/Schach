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

func printBoard(board Board)(boardString string){
	for _,row := range board{
		for _,cell := range row {
			symbol :=piecesToSymbols[cell];
			boardString += fmt.Sprintf("%s",symbol);
		}
		boardString += "\n";
	}
	return 
}
