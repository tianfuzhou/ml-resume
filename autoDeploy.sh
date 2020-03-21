#!/bin/bash
# deploy-dev.sh
#echo Deploy Project # 获取最新版代码

# 拉取代码
git pull

# 打包📦生成新静态资源
npm run build

# 强制重新编译容器
docker-compose down
docker-compose up -d --force-recreate --build