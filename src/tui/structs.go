package main;

// Time is in miliseconds
type gameStruct struct {
    board Board
    moveNumber int
    moves []string
    whiteTimeLeft int // In miliseconds
    blackTimeLeft int// In minliseconds
	color string
    opponentName string
}

type gameActiveSocketResponse struct{
    Error 			bool`json:"error"`
    Message 		string`json:"message"`
    Over 			*bool`json:"over"`
    WhyOver 		*string`json:"whyOver"`
    Winner 			*bool`json:"winner"`// The winner gets true and the un-winner gets false`json:"start"`
    Move 			*string`json:"move"`
    WhiteTimeLeft 	*int`json:"whiteTimeLeft"`
	BlackTimeLeft 	*int`json:"blackTimeLeft"`
}

type gameStartSocketResponse struct{
    Start 			bool   `json:"start"`
    Color 			string `json:"color"`
    OpponentName 	string `json:"opponentName"`
}

type socketMoveRequest struct{
	move string
}
