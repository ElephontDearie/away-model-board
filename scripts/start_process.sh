#!/bin/bash 
container_name=name

#ECR Login
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 992382626730.dkr.ecr.us-east-1.amazonaws.com
#Pulling image from ECR
docker pull 992382626730.dkr.ecr.us-east-1.amazonaws.com/away-tracker:latest

##Changing image tag
docker image tag 992382626730..dkr.ecr.us-east-1.amazonaws.com/away-tracker:latest $container_name:latest

#stop and remove the current container docker rm -f $container_name

#Creating and starting a docker container using a new image
docker run -d -p 80:80 --name $container_name $container_name:latest