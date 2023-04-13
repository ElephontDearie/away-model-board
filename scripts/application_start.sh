#!/bin/bash
cd /home/ubuntu/away-model-board
git pull origin main
yarn install &&
yarn build &&
pm2 restart away-model-tracker-board