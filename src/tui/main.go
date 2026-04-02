package main

import (
	// "net"
	TUI "tui_ssh/schach_TUI"
	// bm "github.com/charmbracelet/wish/bubbletea"
	// wish "github.com/charmbracelet/wish"
)

var host = "0.0.0.0"
var port = "22"

func main(){
	// wish.NewServer(
	// 	wish.WithAddress(net.JoinHostPort(host, port)),
	//        wish.WithHostKeyPath(".ssh/id_ed25519"), // auto-generated if missing
	//        wish.WithMiddleware(
	//            bm.Middleware(TUI.Handler),  // your bubbletea app
	//        ),
	// )
	TUI.Handler()
}
