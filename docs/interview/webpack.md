---
title: webpack中常见的面试题
description: 文章描述
aside: false
date: 2023-02-07
tags:
  - javascript
  - webpack
  - 面试
---

# webpack中常见的面试题


## 常见的配置项

<!-- 详见[webpack的webpack的五个概念](/pages/learn/webpack/#webpack的五个概念) -->

其他的还有`devServer`

## loader 和 plugin 的区


loader直译为加载器，webpack将一切文件视为模块，webpack本身只能解析js和json,loader使webpack可以解析其他类型的文件
是文件一个转换器， 可以将`a文件` 转换成 `b文件` ，单纯的转换过去


而 plugin 是一个扩展器，不直接操作文件，会监听webpack打包过程中的某些节点，执行更广泛的任务

## webpack的构建过程是什么？ 尽量说详细

1. 初始化参数从`shell语句`和`配置文件`中读取与合并参数，确认配置参数。
2. 根据配置参数初始化compiler对象，加载所有配置的插件，得到run函数开始执行编译
3. 确定入口，根据配置中的entry找出所有的入口文件
4. 从入口文件触发，调用所有的loader对模块进行编译，再找出该模块依赖的模块，递归本步，直到所有文件都完成编译
5. 根据入口和模块之间的依赖关系，组成包含多个模块的Chunk，再将每个chunk转换成单独的文件加入到输出列表。
6. 确认好输出内容后，根据配置确定输入的路径和文件名，将文件写入到文件系统中。



## webpack的热更新是怎么实现的，说明其原理。

热更新又名为热替换，可以是浏览器不用刷新而变更新的模块替换掉旧的模块。


1. webpack在监听到文件的改动后，根据配置文件，对该模块进行重新编译打包，并将打包后的代码通过简单的js对象保存在内存中
2. webpack-dev-server通过socket.js的方式建立长连接，更新对应的内容
