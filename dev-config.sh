#!/bin/sh


sudo apt update
sudo apt upgrade -y

# Start the node server
cd /workspaces/server

npm install

npx prisma init
npx prisma generate
npx prisma migrate dev --name init-migrate
npm run seed

npm start