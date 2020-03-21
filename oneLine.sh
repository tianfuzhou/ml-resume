# 删除重制 监听
pm2 del ml-resume-hook

pm2 start --name ml-resume-hook webhooks.js

# 启动docker-compose
docker-compose up