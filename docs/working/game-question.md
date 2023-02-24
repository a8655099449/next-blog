---
title: 玩游戏中遇到的一些问题
description: 文章描述
aside: false
date: 2023-02-07
tags:
  - game
---

# 玩游戏中遇到的一些问题

在玩游戏时总会遇到这样那样的问题，甚至有些游戏，你都可以写一篇长篇论文，下面我会记录在各种游戏中遇到的一些问题


## 写一个亿万僵尸的存档脚本
众所周知，亿万僵尸没有存档功能，一个不小心，就得开饭，然后重新开始，这是游戏的特点，但同时也非常影响我们的游戏体验。


1. 找到游戏的存档位置，比如我的存档目录就是在`D:\我的文档\Documents\My Games\They Are Billions\Saves`
> 技巧。使用EveryThing 搜索关键字`They Are Billions` 很快就能找到

2. 在桌面新建一个目录`亿万僵尸存档` ，然后在文件夹内新建两个文件`copy.bat` \ `set.bat`

然后输入以下的内容

`copy.bat`
```bat
chcp 65001
xcopy "D:\我的文档\Documents\My Games\They Are Billions\Saves" "./Saves"  /s /e /h /y
```

`set.bat`
```bat
chcp 65001
xcopy  "./Saves"  "D:\我的文档\Documents\My Games\They Are Billions\Saves" /s /e /h /y
```

注意，以上的代码中。`D:\我的文档\Documents\My Games\They Are Billions\Saves` 请自动替换成你的目录，而且双引号一定不要忘记加上

![](https://s2.loli.net/2022/12/11/AcPDXSH5iuIaMZo.png)

最后点击保存，双击`copy.bat`等于存档，双击`set.bat`等于设置存档