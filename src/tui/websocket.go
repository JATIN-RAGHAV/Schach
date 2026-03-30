package main

import (
	"encoding/json"
	"fmt"
	"log"

	websocket "github.com/gorilla/websocket"
)

func startSocket(m *model) {

	(*m).status = status_loading;
	time := getTime(*m);
	url := fmt.Sprintf("ws://localhost:2222/game/anonymous/run?color=Random&increment=0&time=%d",time)

	conn, _, err := websocket.DefaultDialer.Dial(url, nil)
	if err != nil {
		log.Fatal("Dial error:", err)
	}
	defer conn.Close()
	(*m).socket = conn;

	// On open handler
	gameObject := initGameStruct(*m);
	(*m).gameStruct = gameObject;
	prog.Send(updateModelTeaMessage{model:*m})

	// On message handler
	for {
		_, msg, err := conn.ReadMessage();
		if err != nil {
			m.status = status_select_game_type;
			conn.Close();
			break;
		}
		(*m).message = msg;

		/*
1-> Start of game
2-> Move made by other player
3-> Move confirmed for the user by backend      ** 2 & 3 can have the same handler **
4-> End of Game
*/

		// Handle Start of game
		if((*m).status == status_loading){
			// Parse response
			var message gameStartSocketResponse;
			if err := json.Unmarshal(msg, &message); err != nil {
				m.status = status_select_game_type;
				conn.Close();
				break;
			}

			(*m).status = status_play;
			(*m).gameStruct.opponentName = message.OpponentName;
			(*m).gameStruct.color = message.Color;
			(*m).gameStruct.whiteTimeLeft = time;
			(*m).gameStruct.blackTimeLeft = time;
			(*m).message = fmt.Appendf([]byte{},"color: %s",message.Color);

		}else{
			// Handle Active Game Response
			// Parse response
			var message gameActiveSocketResponse;
			if err := json.Unmarshal(msg, &message); err != nil {
				m.status = status_select_game_type;
				conn.Close();
				break;
			}

			if(!message.Error){
				// Handle a move made
				// Make move and update time
				if(message.Move != nil){
					move := moveToIndex(*message.Move)
					sCol, sRow , tCol, tRow := move[0],move[1],move[2],move[3];
					(*m).gameStruct.board[tRow][tCol] = (*m).gameStruct.board[sRow][sCol];
					(*m).gameStruct.board[sRow][sCol] = NN;
					(*m).gameStruct.moveNumber++;
					(*m).gameStruct.moves = append((*m).gameStruct.moves,(*message.Move));
				}

				if(message.WhiteTimeLeft != nil){
					(*m).gameStruct.whiteTimeLeft = *message.WhiteTimeLeft;
				}

				if(message.BlackTimeLeft != nil){
					(*m).gameStruct.blackTimeLeft = *message.BlackTimeLeft;
				}

				// Handle Game Over
				if(message.Over != nil && (*message.Over)){
					// Update Game state and game winner
					(*m).status = status_end_game;

					if(message.Winner != nil){
						(*m).winner = *message.Winner
					}

					if(message.WhyOver != nil){
						(*m).whyOver = *message.WhyOver
					}
				}
			}

		}
  		prog.Send(updateModelTeaMessage{model:*m})
	}

	// Handle closing of socket
	(*m).status = status_select_game_type;
	(*m).move = ""
	prog.Send(updateModelTeaMessage{model:*m})
}
