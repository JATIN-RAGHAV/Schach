package main


import (
	"context"
	"net"
	"os"
	"os/signal"
	"syscall"
	"time"

	TUI "tui_ssh/schach_TUI"

	"charm.land/wish/v2"
	"charm.land/wish/v2/activeterm"
	bwish "charm.land/wish/v2/bubbletea"
	"charm.land/wish/v2/logging"
)

const (
	ip = "0.0.0.0"
	port = "4242"
)

func main() {
    s, err := wish.NewServer(
        wish.WithAddress(net.JoinHostPort(ip,port)),
        wish.WithHostKeyPath(".ssh/id_ed25519"),
        wish.WithMiddleware(
            bwish.Middleware(TUI.TeaHandler),
            activeterm.Middleware(), // ensures a PTY is present
            logging.Middleware(),
        ),
    )
    if err != nil {
        panic(err)
    }

    done := make(chan os.Signal, 1)
    signal.Notify(done, os.Interrupt, syscall.SIGINT, syscall.SIGTERM)

    go func() {
        if err := s.ListenAndServe(); err != nil {
            panic(err)
        }
    }()

    <-done

    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()
    s.Shutdown(ctx)
}
