package main

import (
	"encoding/json"

	websocket "github.com/gorilla/websocket"
)

func getTime (m model) (time int){
	time = 0
	switch m.game_types[m.game_type_selected]{
	case Rapid:
        time = 10 * 60 * 1000
    case Blitz:
        time = 3 * 60 * 1000
    case Bullet:
		time = 1 * 60 * 1000
	}
	return
}

func moveToIndex (move string) (moveIndex [4]int){

    moveIndex[0] = int(move[0] - 'a')
    moveIndex[1] = int(move[1] - '1')
    moveIndex[2] = int(move[2] - 'a')
    moveIndex[3] = int(move[3] - '1')
    return
}

func sendMove(move string, socket *websocket.Conn){
	moveStruct := socketMoveRequest{
		move:move,
	}
	moveString,error := json.Marshal(moveStruct)
	if(error == nil){
		socket.WriteMessage(websocket.TextMessage, moveString)
	}
}
