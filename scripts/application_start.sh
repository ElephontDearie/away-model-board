#!/bin/bash
cd /home/ubuntu/away-model-board
git pull
yarn install --ignore-engines &&
yarn build &&
pm2 restart away-model-tracker-board