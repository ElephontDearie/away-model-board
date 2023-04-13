#!/bin/bash
cd /home/ubuntu/away-model-board
node -v
nvm -v
nvm install 18.15.0
nvm alias default 18.15.0
node -v
git pull
rm -rf node_modules yarn.lock
yarn install &&
yarn build &&
pm2 restart away-model-tracker-board