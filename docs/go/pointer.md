---
title: golang 的指针
description: 文章描述
aside: false
date: 2022-12-13
tags:
  - go
---

# golang 的指针

go 语言的函数传参都是值拷贝，当我们想要改变某个变量时，我们可以创建该变量的地址的指针变量，无需拷贝数据

类型指针不能进行偏移和运算

go语言中的指针操作非常简单，只需要记住两个符号， `&`（取地址）和`*`（根据地址取值）


## 指针地址和指针类型

每个变量在运行时都有一个地址，这个地址代表变量在内存中的位置。go语言使用`&`字符在变量前面对变量进行 **取地址** 操作。go语言中的值类型都有对应的指针类型，比如`*int`\ `*int64` \ `*string`


## 指针语法

一个指针变量指向了一个值的内存地址


```go{2,3}
var s = "hello"
var p *string
p = &s
fmt.Printf("p: %v\n", p)
```
![](https://s2.loli.net/2022/12/12/FJAWPdZEwOxCzkr.png)



## 指向数组的指针

go里面，整个数组没有指针，但是数组里面每个值，都有指针，所以我们定义数组的指针思路也是如此

```go
var pa [5]*int

var slice = [5]int{1, 2, 3, 4, 5}

for i := range slice {
  pa[i] = &slice[i]
}
fmt.Printf("pa: %v\n", pa) // -> pa: [0xc00000e420 0xc00000e428 0xc00000e430 0xc00000e438 0xc00000e440]
```