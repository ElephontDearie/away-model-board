#!/bin/bash
cd /home/ubuntu/away-model-board

if [ -d "${HOME}/.nvm/.git" ]; then 
    echo "nvm installed"
else 
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
fi

if [[ $(nvm ls | grep v18.15.0) == "" ]]; then
    nvm install v18.15.0
else
    nvm use v18.15.0
fi

node -v
git pull
yarn install &&
echo "Beginning yarn build" &&
yarn build &&
pm2 restart away-model-tracker-board