## QQ-Guild Bot
基于[kokkoro](https://github.com/kokkorojs/kokkoro)框架，[amesu](https://github.com/xueelf/amesu)的SDK for Node.js进行搭建QQ频道机器人
## 介绍
目前仅支持QQ频道使用，且仅有指令身份认证，取消身份组两个指令  
如需自己开发插件，将插件新建于plugins中，并在app.js中mount
## Install
1.克隆项目
```shell
git clone https://github.com/Clarlotte/QQ-Guild-Bot.git
```
2.安装依赖
```shell
npm i 
```
若运行中有部分依赖提示未安装，请自行安装

3.填写机器人信息  

登录[QQ开放平台](https://q.qq.com/)获取机器人**AppID**，**token**，**AppSecret**，并填写到config.js中  
登录[高德开放平台](https://lbs.amap.com/)，并创建web服务应用获取**key**，登录[彩云天气](https://platform.caiyunapp.com/login)，并创建应用，选择天气，获取**key**

4.启动
```shell
node --experimental-import-meta-resolve app.js
```
使用pm2启动
```shell
pm2 start node --name qq-guild -- --experimental-import-meta-resolve app.js
```
## 项目地址
Gitee：[QQ-Guild-Bot](https://gitee.com/clarlotte/qq-guild-bot)  
Github：[QQ-Guild-Bot](https://github.com/Clarlotte/QQ-Guild-Bot)