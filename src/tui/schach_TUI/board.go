package schach_TUI

import (
	"fmt"
)

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

func printBoard(board Board,color color,whiteTimeLeft int, blackTimeLeft int)(boardString string){
	whiteClock := printClock(whiteTimeLeft);
    blackClock := printClock(blackTimeLeft);
	if(color == White){
		boardString += styles_left_align.Render(blackClock) + "\n";
		for i := len(board)-1 ; i>=0 ;i--{
			boardString += fmt.Sprintf("%d ",i+1);
			for j := range len(board){
				symbol := piecesToSymbols[board[i][j]];
				boardString += fmt.Sprintf("%s ",symbol);
			}
			boardString += "\n";
		}
		boardString += "  a b c d e f g h\n";
		boardString += styles_right_align.Render(whiteClock) + "\n";
	}else{
		boardString += styles_left_align.Render(whiteClock) + "\n";
		for i := range len(board){
			boardString += fmt.Sprintf("%d ",i+1);
			for j := len(board[i])-1 ; j>=0; j--{
				symbol := piecesToSymbols[board[i][j]];
				boardString += fmt.Sprintf("%s ",symbol);
			}
			boardString += "\n";
		}
		boardString += "  h g f e d c b a\n";
		boardString += styles_right_align.Render(blackClock) + "\n";
	}
	return 
}

func printClock(i int)(clock string){
	seconds := i / 1000;
	minutes := seconds / 60;
	seconds = seconds % 60;
	clock = styles_Red_text_border.Render(fmt.Sprintf("%02d:%02d",minutes,seconds));
	return
}
