#!/bin/bash
docker images --no-trunc -aqf "dangling=true" | xargs docker rmi;
truncate -s 0 /var/lib/docker/containers/*/*-json.log;

docker build -t frontend:latest .
docker stop frontend
docker rm frontend
docker run -dit \
	--name frontend \
	--restart=always \
	-p 8081:80 \
	--env-file .env \
frontend:latest
