# 删除重制 监听
pm2 del ml-resume-hook

pm2 start --name ml-resume-hook webhooks.js

# 自动部署
sh autoDeploy.sh