# away-model-board

## Running tests
For interactive testing
```bash
npm run cypress # or
yarn cypress # or
pnpm cypress 
```
For headless, automatic runs
```bash
npm run cy:run # or
yarn cy:run # or
pnpm cy:run 
```
## Running the Development server

```bash
npm run dev # or
yarn dev # or
pnpm dev 
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## Setup for migration to a new Host
### Node via NVM
If minimum node version of 18.15.0 is not installed, install with the below. 
Install nvm: 
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
```
Install mimimum stable node version 18.15.0
```bash
nvm install 18.15.0
```
### Prisma
On a new host, run these commands to set up the prisma database
```npx prisma migrate dev --name away-tracker```
```npx prisma generate```
```npm run build```

## pm2
pm2 is used to persist the production server.
`pm2 start "yarn start" --name away-model-tracker-board -- start -p 3000`
Restore pm2 instances on reboot
`pm2 resurrect`

## AWS CodeDeploy agent (required for CodePipeline deployments)
### check status
sudo service codedeploy-agent status
### start service if not running
sudo service codedeploy-agent start


## Docker

```bash
docker build -t away-tracker .  
docker run -p 3000:3000 away-tracker
```