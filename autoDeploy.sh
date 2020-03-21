#!/bin/bash
# deploy-dev.sh
#echo Deploy Project # 获取最新版代码

# 拉取代码
git pull

# 打包📦生成新静态资源
npm run build

# 复制 静态资源 到 /usr/share/nginx/html/ 下
cp -r ./.public/. /usr/share/nginx/html/

# 删除老pm2进程
pm2 del ml-resume

# 新建新进程
pm2 start npm --name ml-resume -- run server

# 强制重新编译容器
# docker-compose down
# docker-compose up -d --force-recreate --build