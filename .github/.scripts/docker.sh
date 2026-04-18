#!/bin/bash

# Get the latest images
sudo docker pull jatinraghav137/backend:latest
sudo docker pull jatinraghav137/nginx:prod
sudo docker pull jatinraghav137/tui:latest

# Create network if it doens't exist
sudo docker network inspect schach >/dev/null 2>&1 || sudo docker network create schach

# Stop existing containers
sudo docker rm -f backend nginxprod tui >/dev/null 2>&1

echo $BACKEND_URL

# Start the containers
sudo docker run -d --name backend --restart on-failure:10 -e DATABASE_URL="$DATABASE_URL" --network schach jatinraghav137/backend

sudo docker run -d --name nginxprod --restart on-failure:10 -p 80:80 jatinraghav137/nginx:prod

sudo docker run -d --name tui --restart on-failure:10 -p 22:22 -e BACKEND_URL="$BACKEND_URL" --network schach jatinraghav137/tui
