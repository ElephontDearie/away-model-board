#!/bin/bash
cd /home/ubuntu/away-model-board

if [ -d "${HOME}/.nvm/.git" ]; then 
    echo "nvm installed"
else 
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
fi

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

if [[ $(nvm ls | grep v18.15.0) == "" ]]; then
    nvm install v18.15.0
else
    nvm use v18.15.0
fi

node -v
whoami
git pull origin main
yarn install &&
echo "Beginning yarn build" &&
yarn build 

if hash pm2 2>dev.null; then echo "pm2 exists"; else yarn global add pm2; fi

pwd
if [[ $(echo sudo pm2 describe away-model-tracker-board == "") ]]; then
    echo "Starting new process"
    pm2 start "yarn start" --name away-model-tracker-board -- start -p 3000
else
    echo "Restarting process"
    pm2 restart away-model-tracker-board
fi