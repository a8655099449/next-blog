---
title: go的协程
description: 文章描述
aside: false
date: 2023-01-11
tags:
	- go
---

# 协程

来看一个例子
```go
package main

import (
	"fmt"
	"time"
)

func showMsg(msg string) {
	for i := 0; i < 3; i++ {
		fmt.Println(`show msg...` + msg)
		//设置一个程序 每打印一次后，休息一秒钟
		time.Sleep(time.Second * 1)
	}
}

func main() {
	showMsg(`111`)
	showMsg(`222`)
	print(`执行下面的内容`)
}
```

定义了一个`showMsg`，这是一个延时函数


函数的执行方法是从上到下的，所以输出了以下内容
```
show msg...111
show msg...111
show msg...111
show msg...222
show msg...222
show msg...222
执行下面的内容
```
前面的两个程序阻止了主程序6s中的时间，这对于程序是致命的

如果我们不希望这种延时函数阻止主程序执行，那么就需要启用一个`协程`,关键字是`go`


```go
func main() {
	go showMsg(`111`) // 在第一个函数启动一个协程
	showMsg(`222`)
	print(`执行下面的内容`)
}
```

**查看执行结果**
```
show msg...111
show msg...222
show msg...222
show msg...111
show msg...111
show msg...222
执行下面的内容
```

> 两个函数开始交替进行执行，主程序在第三秒的时候开始执行


如果我们在两个函数上都启动协程会发生什么呢？

```go
func main() {
	go showMsg(`111`) // 在第一个函数启动一个协程
	go showMsg(`222`)
	print(`执行下面的内容`)
}
```
**查看执行结果**
```
执行下面的内容
```


> 因为主程序的关闭，两个协程也被关闭了。

## WaitGroup 实现等待协程
WaitGroup 就是一个等待协程结束的结构

```go{9,22,24-25}
package main

import (
	"fmt"
	"sync"
	"time"
)

var wp sync.WaitGroup

func showMsg(msg string) {
	defer wp.Done()
	for i := 0; i < 3; i++ {
		fmt.Println(`show msg...` + msg)
		//设置一个程序 每打印一次后，休息一秒钟
		time.Sleep(time.Second * 1)
	}
}

func main() {
	go showMsg(`111`)
	wp.Add(1)
	go showMsg(`222`)
	wp.Add(1)
	wp.Wait()
	print(`执行下面的内容`)
}

```

## sync.Mutex
使用sync.Mutex加锁的方式，来解决两个携程操作一个变量导致计算错误的


```go{12,14}
package main

import (
	"sync"
	"time"
)

var count = 100
var lock sync.Mutex

func add() {
	lock.Lock()
	count++
	lock.Unlock()
}
func sub() {
	lock.Lock()
	count--
	lock.Unlock()
}
func main() {
	for i := 0; i < 100; i++ {
		go sub()
		go add()

	}

	time.Sleep(time.Second)
	println(`count=`, count)
}

```
## 原子操作
### 加减

原子操作也可以让两个携程操作一个变量  并在高并发期间，保持不冲突
```go
package main

import (
	"sync/atomic"
	"time"
)

var count int32 = 100

func add() {
	atomic.AddInt32(&count, 1)
}
func sub() {
	atomic.AddInt32(&count, -1)
}
func main() {
	for i := 0; i < 100; i++ {
		go sub()
		go add()

	}
	time.Sleep(time.Second)
	println(`count=`, count)
}

```
### 读写
```go
package main

import (
	"sync/atomic"
)

var count int32 = 100

func add() {
	atomic.AddInt32(&count, 1)
	val := atomic.LoadInt32(&count)
	atomic.StoreInt32(&count, 600)
	println(val)   // 101
	println(count) //600
}

func main() {
	add()
}
```






## runtime.Gosched
> `runtime.Gosched`的作用是让出cpu的时间片。当有协程执行时，先让协程执行完毕，再执行

```go{16}
package main

import (
	"fmt"
	"runtime"
)

func showMsg(msg string) {
	for i := 0; i < 3; i++ {
		fmt.Println(`show msg...` + msg)
	}
}
func main() {
	go showMsg(`111`)
	for i := 0; i < 4; i++ {
		runtime.Gosched() // 当有任务执行时，让出来
		print(`执行后面的内容...`, "\n")
	}
	print(`end...`)

}
```
**输出结果**

```go
执行后面的内容...
show msg...111
执行后面的内容...
show msg...111
执行后面的内容...
show msg...111
执行后面的内容...
end...
```
> 第一次跑到前面可能是主进程执行的更快那时候cpu本来就属于空置状态,
> 假如注释掉runtime.Gosched()那么协程将可能在还没有执行完毕，就被关闭



##  runtime.Goexit()

`runtime.Goexit()` 的作用是退出协程


```go
package main

import (
	"fmt"
	"runtime"
	"time"
)

func showMsg() {
	for i := 0; i < 10; i++ {
		if i == 5 {
			runtime.Goexit() // 退出协程
		}
		fmt.Println(`show msg...`, i)
	}
}

func main() {
	go showMsg()

	time.Sleep(time.Second)

}

```
## runtime.NumCPU()

获取cpu核数