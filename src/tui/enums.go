package main

// State of the game
type status int;
const (
	status_select_game_type status = iota
	status_loading
	status_play
	status_end_game
)

// Types of games
const (
	Rapid = "Rapid"
	Blitz = "Blitz"
    Bullet = "Bullet"
)

// Colors
const (
	White = "White"
	Black = "Black"
)

// Pieces
type piece int;
const (
	WP piece = iota
    WN
    WB
    WR
    WQ
    WK
    BP
    BN
    BB
    BR
    BQ
    BK
	NN
);

type Board [8][8]piece;

type gameOverReasons string;
const (
	checkmate gameOverReasons = "checkmate"
    stalemate gameOverReasons = "stalemate"
    threefoldRepetition gameOverReasons = "threefoldRepetition"
    insufficientMaterial gameOverReasons = "insufficientMaterial"
    timeover gameOverReasons = "timeover"
    otherResigned gameOverReasons = "otherResigned"
    otherAbandoned gameOverReasons = "otherAbandoned"
    notOver gameOverReasons = "notOver"
)
