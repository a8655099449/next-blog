---
title: git 使用的一些问题
description: 文章描述
aside: false
date: 2023-02-07
tags:
  - other
---

# git 使用的一些问题

## 在github 上配置了sshKey 不生效

由于我的电脑长时间挂了代理，所以有可能出现这种情况，用下面的指令测试性
```sh
ssh -T git@github.com
```

如果出现了 `kex_exchange_identification: Connection closed by remote host` 就是没有成功

可以在.ssh 文件夹下添加`config`文件，写入以下内容后解决

```
Host github.com
    HostName ssh.github.com
    User git
    Port 443
```

## 更新推送地址

```sh
git remote set-url origin [url]
```
## 暂存工作区的内容
```sh
# 保存当前未commit的代码
git stash

# 保存当前未commit的代码并添加备注
git stash save "备注的内容"

# 列出stash的所有记录
git stash list

# 删除stash的所有记录
git stash clear

# 应用最近一次的stash
git stash apply

# 应用最近一次的stash，随后删除该记录
git stash pop

# 删除最近的一次stash
git stash drop
```
## 如何在.gitignore设置，单独打开某个文件夹上传
有时候我们要有这要的需求，禁止A文件夹中的全部文件上传，但要让A文件夹中的A1文件夹上传，在文件中输入以下内容


```
/A/* 
!/A/A1/
```