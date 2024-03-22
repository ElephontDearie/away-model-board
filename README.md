# away-model-board


## Running the Development server

#### Run from local machine
* Use node version 18.17.0 or higher using nvm or another node manager
    * Install nvm: `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash`
    * Install mimimum stable node version: `nvm install 18.17.0`
    * Use minimum stable node version: `nvm use 18.17.0`

* Install node package dependencies
```bash
npm run clean
npm i
```
* Set up the prisma database
```bash
npx prisma generate
npm run build
npx prisma migrate dev --name away-tracker
```
* Open [http://localhost:3000](http://localhost:3000) with your browser to see the web server


#### Alternatively run with Docker

```bash
docker build -t away-tracker .  
docker run -p 3000:3000 away-tracker
```

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

## Setup for migration to a new Host without Docker

#### With Docker
* Use`buildspec.yml` for building and publishing the image to AWS ECR
* Use `appspec.yml` in deployment to point AWS EC2 host to script start location

#### Without Docker
* Modify appspec.yml with `runas: ubuntu`. See [AppSpec file reference](https://docs.aws.amazon.com/codedeploy/latest/userguide/reference-appspec-file.html).
* Use appspec.yml for deploy to point at `application_start.sh` file under scripts as the host start script.
* pm2 is used to persist the production server.
```pm2 start "yarn start" --name away-model-tracker-board -- start -p 3000```
 * Restore pm2 instances on reboot
 ```pm2 resurrect```

#### AWS CodeDeploy agent (required for CodePipeline deployments)
* check status
```sudo service codedeploy-agent status```
* start service if not running
```sudo service codedeploy-agent start```



