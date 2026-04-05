git pull

## Backend
/home/admin/.bun/bin/pm2 restart backend

## TUI
cd src/tui
go build
/home/admin/.bun/bin/pm2 restart tui
