---
title: 在自己的服务器上搭建内网穿透服务
description: 文章描述
aside: false
date: 2023-02-07
tags:
  - other
---

# 在自己的服务器上搭建内网穿透服务

在之前的文章中，我曾说道内网穿透的诸多功能。并推荐了市面上主流的内网穿透工具，但是经过一段时间的使用，发现这些工具还是太拉了。

它们要么速度太慢，要么就是需要付费，要么就是不稳定。那么可不可以在自己的服务器上的搭建内网穿透服务呢？

答案当然是**可以**，而且在自己的服务器上搭建内网穿透有一下的优点：

1. 域名可以自定义
2. 速度快，取决于你的服务器速度
3. 稳定

搭建内网穿透根据有很多种，今天推荐的是[frp](https://github.com/fatedier/frp) 

[frp文档地址](https://gofrp.org/)

## 服务端部署

### 1. 下载服务端的包 [下载地址](https://github.com/fatedier/frp/releases)
> 一般我们的服务器都是使用linux部署 ，下载后缀为 `linux_amd64.tar.gz`就可以了 

###  2. 解压压缩包
```sh
tar -zxvf frp_0.41.0_linux_amd64.tar.gz 
cd frp_0.41.0_linux_amd64/
```

###  3. 配置文件

输入 `ls` 后 可以看到以下的几个文件
```
frpc  
frpc_full.ini  
frpc.ini  
frps  
frps_full.ini 
frps.ini  
LICENSE  
systemd
```
在服务端上我们需要关注的是这两个文件 `frps.ini(配置)` 和 `frpc(客户端)` 启动


修改 `frps.ini`的内容


```ini
[common]
# frp监听的端口，默认是7000，可以改成其他的
bind_port = 7010
# 为web服务的端口
vhost_http_port  = 7012
```

### 4. 启动服务

在启动前 ，需要配置下持续化部署

执行以下的命令
```sh
mkdir -p /etc/frp
cp frps.ini /etc/frp
cp frps /usr/bin
cp systemd/frps.service /usr/lib/systemd/system/
systemctl enable frps
systemctl start frps
```

开放端口访问

```sh
# 添加监听端口
sudo firewall-cmd --permanent --add-port=7010/tcp
# 添加管理后台端口
sudo firewall-cmd --permanent --add-port=7012/tcp
sudo firewall-cmd --reload
```


然后我们就可以访问 `xxx.xxx.xxx:7500`  确认服务是否启动成功了

接下来配置客户端



后面我们可以通过以下的命令来启动或者关闭内网服务

```sh
# 启动服务
systemctl start frps
# 停止服务
systemctl stop frps
# 查看服务状态
systemctl status frps
```



## 客户端使用


客户端一般就是我们使用的电脑，比如我目前使用的 `window10` 系统，

第一步 还是在[github](https://github.com/fatedier/frp/releases)上下载包，不过这次我们要下载的是windows

使用的也变成了 `frpc 和 frpc.ini` 了

下载完后打开 `frpc.ini` 文件

修改以下的内容


```sh
[common]
server_addr = xxx.xxx.xxx  # 你的服务器ip
server_port = 7010

[web]
type = http
# 本地服务端口
local_port = 8080
# 访问的域名 请提前做好解析
custom_domains = www.woai996.com

[web2]
type = http
local_port = 8001
custom_domains = a1.woai996.com
[web3]
type = http
local_port = 8002
custom_domains = a2.woai996.com
```

以上我们分别代理了三个接口，使用了三个不同的域名 （**这些域名需要你提前解析到了你的服务器**）  


修改完后 ，使用 `cmd` 执行 `fprc -c frpc.ini`  当出现 `success` 的提示时，说明已经代理成功了

尝试访问 `www.woai996.com:7012` 来查看自己的服务




