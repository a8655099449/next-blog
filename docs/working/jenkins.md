---
title: 在服务器上部署Jenkins
description: jenkins
aside: false
date: 2023-02-16
tags:
  - tool
---


jenkins 是一种持续集成技术，免去了部署步骤，让部署变得非常轻松容易。


相关文档

- [jenkins中文文档](https://www.jenkins.io/zh/doc/)
- [2022Jenkins部署教程](https://juejin.cn/post/7048582881576222734)
- [从零开始搭建JENKINS+GITHUB持续集成环境【多图】](https://juejin.cn/post/6844903992833605640#heading-8)

## 在服务器上安装 jenkins

1. 先安装java的jdk，最新版本的Jenkins必须使用java11

```
yum install java-11-openjdk-devel
```

2. 安装Jenkins


2.1 添加Jenkins仓库的GPG密钥：
```
sudo rpm --import https://pkg.jenkins.io/redhat-stable/jenkins.io.key
```

2.2 添加Jenkins仓库的软件包存储库

```
sudo sh -c 'echo -e "[jenkins]\nname=Jenkins\nbaseurl=https://pkg.jenkins.io/redhat-stable/\ngpgcheck=1" > /etc/yum.repos.d/jenkins.repo'
```

2.3 安装Jenkins
```
sudo yum install jenkins
```


## 启动jenkins

我们可以使用以下的命令来启动或者关闭Jenkins

```shell
# 启动jenkins
systemctl start jenkins

# 查看Jenkins的状态
systemctl status jenkins

# 停止Jenkins
systemctl stop jenkins

# 设置Jenkins开机启动
systemctl enable jenkins
```

输入`systemctl start jenkins`启动指令后，我们可以使用`systemctl status jenkins`查看当前Jenkins的状态。

如果是`running`说明已经启动成功了，我们可以访问 `http://yourip:8080`来访问地址

![](https://s2.loli.net/2023/02/16/EWwRqlg5YtxznAc.png)


第一次进入需要输入密码，可以通过以下的指令查看初始的密码
```
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```
![](https://s2.loli.net/2023/02/17/5luYzGvAdkiZULW.png)


输入密码后，会有一个初始化的过程，然后就会进入一个安装插件的界面，这个可以选择推荐的，也可以不装

然后就是这个界面

![](https://s2.loli.net/2023/02/17/jiaeAZRF3MHCVvW.png)

创建完账号后，进入这个页面

![](https://s2.loli.net/2023/02/17/JP32GC8tuTEmoah.png)

## 创建项目

1. 点击`new Item`

![](https://s2.loli.net/2023/02/17/H4qXjuyTs7IW8CK.png)

2. 输入项目名字
![](https://s2.loli.net/2023/02/17/XrxLfvPtdbklz5a.png)

接下来进入配置页面


第一个`general`选项描述可以随便写
![](https://s2.loli.net/2023/02/17/uwXFG6egcBQs42E.png)

## 配置git 仓库

![](https://s2.loli.net/2023/02/17/k2B4HLbglmpn9YT.png)

**添加权限验证**
![](https://s2.loli.net/2023/02/17/QmPXSpW8jrMil6n.png)
