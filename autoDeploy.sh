#!/bin/bash
#deploy-dev.sh
echo Deploy Project # 获取最新版代码

git pull

npm run pub

# 强制重新编译容器
docker-compose down
docker-compose up -d --force-recreate --build