#!/bin/bash
cd /home/ubuntu/away-model-board
node -v
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
source ~/.bashrc
nvm -v
nvm install 18.15.0
nvm alias default 18.15.0
node -v
git pull
rm -rf node_modules yarn.lock
yarn install &&
yarn build &&
pm2 restart away-model-tracker-board