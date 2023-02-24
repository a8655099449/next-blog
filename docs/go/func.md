---
title: go的函数
description: 文章描述
aside: false
date: 2023-02-07
tags:
	- go
---


# go的函数
在go 中，函数是一级公民，这和js一样。

## go函数的特性

1. go语言中有3种函数：普通函数、匿名函数（没有名称的函数）、方法（定义在struct上的函数）。
2. go语言中不允许函数重载(overload),也就是说不允许函数同名。
3. go语言中的函数不能嵌套函数，但可以嵌套置名函数。
4. 函数是一个值，可以将函数赋值给变量，使得这个变量也成为函数。
5. 函数可以作为参数传递给另一个函数。
6. 函数的返回值可以是一个函数。
7. 函数调用的时候，如果有参数传递给函数，则先拷贝参数的副本，再将副本传递给函数。
8. 函数参数可以没有名称。



## 函数的定义和调用
```go
func add(num1 int, num2 int) int {
	return num1 + num2
}

func main() {
	res := add(1, 2)
	fmt.Printf("res: %v\n", res)
}
```


## 函数的返回值

1. 函数可以没有返回值

2. 函数返回值的变量可以不定义
![](https://s2.loli.net/2022/12/11/onmPTcIRyxDYirF.png)
3. 当定义函数返回值后，可以return空，默认就是返回定义的返回值
![](https://s2.loli.net/2022/12/11/MYCsfNhVLdakvbj.png)
4. 可以返回多个值
![](https://s2.loli.net/2022/12/11/8ED5zrsMVdKpbiY.png)

## 函数的参数

1. go 语言函数可以有0或多个参数，参数需要指定数据类型。
2. 声明函数时的参数列表叫做形参，调用时传递的参数叫做实参。
3. go 语言是通过传值的方式传参的，意味着传递给函数的是拷贝后的副本，所以函数内部访问、修改的也是这个副
本
![](https://s2.loli.net/2022/12/11/IlWPCBajr5wd16K.png)

4. go 语言可以使用变长参数，有时候并不能确定参数的个数，可以使用变长参数，可以在函数定义语句的参数部分
使用`ARGS...TYPE`的方式。这时会将`...`代表的参数全部保存到一个名为ARGS的`切片`中，注意这些参数的数据类
型都是TYPE。

![](https://s2.loli.net/2022/12/11/AEnNeUWSv9V87YG.png)

:::warning
这种可变长度参数，必须要定义在参数中的**最后一位**
:::


## 定义函数类型

```go
type addFn func(int, int) int
```
**使用**

```go{12}
package main

import "fmt"

type addFn func(int, int) int

func add (a int , b int) int  {
	return a + b
}

func main() {
	var f addFn = add
	res := f(1, 2)
	fmt.Printf("res: %v\n", res)
} 
```


## 高阶函数

很多语言都有`高阶函数`这一酷炫的名称，实际上概念并不复杂，高阶函数就是指以函数作为参数
```go
func hightFunc(cb func(string)) {
	fmt.Printf("我是高阶函数\n")
	cb(`高阶函数返回的参数`)
}

func main() {
	hightFunc(func(s string) {
		fmt.Printf("s: %v\n", s)
	})
}
```
也可以返回一个函数
```go{2-4}
func getAddFn() func(int, int) int {
	return func(n1 int, n2 int) int {
		return n1 + n2
	}
}

func main() {
	add := getAddFn()
	v := add(1, 2)
	fmt.Printf("v: %v\n", v)

}
```


## 匿名函数
匿名函数是指在`func`后面没有跟函数名称

这也可以解决在go中函数不能嵌套声明的问题

```go{2-4}
func main() {
	add := func(a int, b int) int {
		return a + b
	}
	res := add(1, 2)
	fmt.Printf("res: %v\n", res)

}
```

**自调用函数**

函数声明的同时即会调用
```go{7}
func main() {
	var l = []int{1, 2, 3, 4}
	func(slice []int) {
		for _, v := range slice {
			fmt.Printf("v: %v\n", v)
		}
	}(l)
}
```

## 函数的闭包

闭包的概念也是许多语言通用的，简单来说，就是**函数内部用到了函数外部的变量，而这个变量的值在外部的生命周期内，都会进行保存**。让我们来使用一个例子来进行说明
```go
func fun1() func(y int) int {

	var x int
	return func(y int) int {
		x += y // x为函数外部的变量
		return x
	}
}
func main() {
	add := fun1()
	res := add(10)
	fmt.Printf("res: %v\n", res) // 10
	res = add(20)
	fmt.Printf("res: %v\n", res) // 30 上次的值被保存了
	res = add(30)
	fmt.Printf("res: %v\n", res) // 60 上次的值被保存了
	add = fun1() // 10 重新声明外部函数后，x归0
	res = add(10) 
	fmt.Printf("res: %v\n", res) // 10
}
```


![](https://s2.loli.net/2022/12/11/GXK9cDQyU3mhg5v.png)

**例子2：**
```go
func calc(base int) (func(int) int, func(int) int) {
	add := func(n int) int {
		base += n
		return base
	}
	sub := func(n int) int {
		base -= n
		return base
	}
	return add, sub
}

func main() {
	var base = 0 // 
	var add, sub = calc(base)
	r := add(10)
	fmt.Printf("r: %v\n", r) // 0 + 10 = 10
	r = sub(5)
	fmt.Printf("r: %v\n", r) // 10 - 5 = 5
	r = add(6)
	fmt.Printf("r: %v\n", r) // 5 + 6 = 11
}
```
## 递归 （recursion）
递归的意思就是函数调用自己本身

1. 递归是指函数自己调用自己
2. 必须要明确函数的退出条件，否则就会产生无限调用
3. 递归很容易产生内存溢出，谨慎使用


下面我们使用递归函数需要实现这样的功能

当第一个参数传入`3` 时，返回的结果是 `1 + 2 + 3`

当第一个参数传入`5` 时，返回的结果是 `1 + 2 + 3 + 4 + 5`

... 以此类推

```go{3-4}
func add(n int, initValue int) int {
	initValue += n
	if n > 0 { // 明确的中止条件
		initValue = add(n-1, initValue) // 函数调用自身
	}
	return initValue
}

func main() {
	r1 := add(6, 0)
	fmt.Printf("r1: %v\n", r1)
}

```

## init 函数

init 函数是go里面的一个特殊的函数，先于`main`函数执行，适合做一些初始化


### init 函数的特性

- init函数先于`main`函数自动执行，不能被其他函数调用
- init函数没有输入参数、返回值
- 每个包可以有多个init函数
- 包的每个源文件也可以有多个`init`函数，这点比较特殊
- 同一个包的`init`执行顺序，golang没有明确定义，编程时要注意程序不要依赖这个执行顺序。
- 不同包的`init`函数按照包导入的依赖关系决定执行顺序。

![](https://s2.loli.net/2022/12/11/gfTsu8mXiOhIv1B.png)