#!/bin/bash
cd /home/ubuntu/away-model-board
which node
sudo npm i -g npm@latest
which node
git pull
rm -rf node_modules yarn.lock
yarn install &&
yarn build &&
pm2 restart away-model-tracker-board