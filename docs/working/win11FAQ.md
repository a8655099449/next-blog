---
title: 使用win11遇到的一些问题
description: 文章描述
aside: false
date: 2023-02-07
tags:
  - other
---

# 使用win11遇到的一些问题

## 很多软件的菜单，都隐藏在`显示更多选项`内，该如何解决?

解决方案可以参考这篇文章 [解决win11更多选项问题](https://www.yesdotnet.com/archive/post/255346446712837.html)



## 打开游戏，老是弹出`需要使用新应用以打开此ms-gamingoverlay链接`提示？

在微软的应用商店下载`Xbox Game Bar` 这个软件，或者以管理员身份运行
```sh
Get-AppxPackage -AllUsers| Foreach {Add-AppxPackage -DisableDevelopmentMode -Register "$($_.InstallLocation)\AppXManifest.xml"}
```
