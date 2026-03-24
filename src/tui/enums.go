package main

// State of the game
type status int;
const (
	status_select_game_type status = iota
	status_loading
	status_play
	status_end_game
)
