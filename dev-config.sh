#!/bin/sh


sudo apt update
sudo apt upgrade -y

# Start the node server
cd /workspaces/server

npm install
npm start