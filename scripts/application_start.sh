#!/bin/bash
cd /home/ubuntu/away-model-board
pwd
git pull
rm -rf node_modules yarn.loc
yarn install &&
yarn build &&
pm2 restart away-model-tracker-board