package schach_TUI;

import (
	"github.com/gorilla/websocket"
)

var messageChan = make(chan []byte)
var closeSocketChan = make(chan bool)

func closeSocket() {
	closeSocketChan <- true
}

func openSocket(){
	closeSocketChan = make(chan bool)
}

func getMessage(socket *websocket.Conn) {
	for {
		_,msg,err := socket.ReadMessage();
		if err != nil{
			closeSocket()
			break;
		}
		messageChan <- msg;
	}
}

