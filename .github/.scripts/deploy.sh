git pull

## Backend
/home/admin/.bun/bin/pm2 restart backend

## TUI
cd src/tui
go build
sudo setcap 'cap_net_bind_service=+ep' ./tui_ssh
/home/admin/.bun/bin/pm2 restart tui
