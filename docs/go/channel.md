---
title: 通道(channel)
description: 文章描述
aside: false
date: 2023-02-07
tags:
	- go
---

# 通道(channel)

在上篇中我们讲到了[协程](./routine.md),这里介绍另外一个go的概念，通道，通道的主要作用是，可以使两个协程之间，进行image.png


需要在声明通道时指定数据类型。我们可以共享内置、命名、结构和引用类型的值和指针。数据在通道上传递：在任何给定时间只有一个goroutine可以访问数据项：因此按照设计不会发生数据竞争。

根据数据交换的行为，有两种类型的通道：无缓冲通道和缓冲通道。无缓冲通道用于执行goroutine之间的同步通
信，而缓冲通道用于执行异步通信。无缓冲通道保证在发送和接收发生的瞬间执行两个goroutine之间的交换。缓
冲通道没有这样的保证。



## 通道的发送和接收特性

1. 对于同一个通道，发送操作之间是互斥的，接收操作之间也是互斥的。
2. 发送操作和接收操作中对元素值的处理都是不可分割的。
3. 发送操作在完全完成之前会被阻塞。接收操作也是如此。

```go
package main

import (
	"math/rand"
	"time"
)

var chan1 = make(chan int)

func send() {
	val := rand.Intn(100)
	time.Sleep(time.Second * 1) // 等待一秒钟
	print("发送的值为->>", val, "\n")
	chan1 <- val

}

func main() {
	defer close(chan1) // 关闭通道
	go send()
	// 主程序等待接收值完成才进行下一步，
	val := <-chan1 // 接收通道的值
	print("接收的值为->>", val)
	print(`end...`)
}
```


## 通道的遍历

```go{10}
package main

func main() {
	var c = make(chan int)

	go func() {
		for i := 0; i < 5; i++ {
			c <- i
		}
		close(c)
	}()

	for v := range c {
		println(v)
	}
}
```
如果通道没有关闭，循环就会出现死锁报错


## select 关键字

1. select是Go中的一个控制结构，类似于switch语句，用于处理异步io操作。select会监听case语句中
channel的读写操作，当case中channel读写操作为非阻塞状态（即能读写）时，将会触发相应的动作。
> select中的case语句必须是一个channel操作
> select中的default子句总是可运行的.
2. 如果有多个case都可以运行，select会随机公平地选出一个执行，其他不会执行。
3. 如果没有可运行的case语句，且有default语句，那么就会执行default的动作。
4. 如果没有可运行的case语句，且没有default语句，select将阻塞，直到某个case通信可以运行


示例
```go
package main

import "time"

func main() {
	var chanString = make(chan string)
	var chanInt = make(chan int)

	go func() {
		chanString <- "hello"
		time.Sleep(time.Second)
		chanInt <- 100
	}()
	var count = 0
	for {
		select {
		case v := <-chanString:
			println(v, "string")
		case v := <-chanInt:
			println(v, "string")
		default:
		}
		time.Sleep(time.Second)
		//println("测试", count)
		count++
		if count == 5 {
			break
		}
	}
}
```


## 定时器原理

```go
package main

import (
	"fmt"
	"time"
)

func main() {
	timer := time.NewTimer(time.Second * 2) // 延迟两秒钟
	now := time.Now()
	fmt.Printf("now->>%v \n", now)
	t1 := <-timer.C
	fmt.Printf("t1->>%v \n", t1)
}
```
t1是一个通道值，可以看到t1的值比当前时间延迟了两秒才给到，相当于延迟了两秒钟

输出
```
now->>2022-12-16 15:26:37.1445663 +0800 CST m=+0.004321801 
t1->>2022-12-16 15:26:39.1450155 +0800 CST m=+2.004771001 
```
### 其他常用的方法
```go{3}
func main() {
	now := time.Now()
	time.Sleep(time.Second * 2)
	t1 := time.Now()
	fmt.Printf("now->>%v \n", now)
	fmt.Printf("t1->>%v \n", t1)
}
```

```go
func main() {
	now := time.Now()
	<-time.After(time.Second * 2)
	fmt.Printf("now->>%v \n", now)
	t1 := time.Now()
	fmt.Printf("t1->>%v \n", t1)
}
```


## ticker

ticker 是可以重复运行的定时器

```go
package main

import (
	"time"
)

func main() {
	tick := time.NewTicker(time.Second)
	var i = 0
	for _ = range tick.C {
		i++
		println(i)
		if i > 5 {
			tick.Stop() // 停止定时器
		}
	}
}
```


