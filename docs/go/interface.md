---
title: go的接口
description: 文章描述
aside: false
date: 2022-12-14
tags:
	- go
---
# 接口
go语言的接口，是一种新的类型定义，它把所有具有共性的方法定义在一起，任何其他类型，只要实现了这些方法就是实现了这个接口

实际上接口我们也能把他当作一种类型

## 定义接口


```go
package main

import (
	"fmt"
	"math"
)

// 定义一个形状的接口.方法是获取面积
type share interface {
	area() float64
}

// 定义结构体 方形
type Rect struct {
	width  float64
	height float64
}

// 定义结构体圆形
type Circle struct {
	radius float64
}

func (c Circle) area() float64 {
	return c.radius * math.Pi * c.radius
}
func (r Rect) area() float64 {
	return r.width * r.height
}

func main() {

	var s1 share = Rect{
		width:  10,
		height: 5,
	}
	var s2 share = Circle{
		radius: 3,
	}

	fmt.Printf("s1.area(): %v\n", s1.area())
	fmt.Printf("s2.area(): %v\n", s2.area())
}
```
当结构体没有实现该方法时，就无法使用接口当作类型

![](https://s2.loli.net/2022/12/13/LBc3z59SvZfoDps.png)


## 联合接口

联合接口指的是 **一个接口由其他的多个接口组合而成** .


```go{14}
package main

import (
	"fmt"
)

type Color interface {
	getColor() string
	setColor(s string)
}

// 定义一个形状的接口.方法是获取面积
type share interface {
	Color // 一个接口的成员是另一个接口
	area() float64
}

// 定义结构体 方形
type Rect struct {
	width  float64
	height float64
	color  string
}

func (r Rect) area() float64 {
	return r.width * r.height
}
func (r Rect) getColor() string {
	return r.color
}
func (r *Rect) setColor(s string) {
	r.color = s
}


func main() {
	var s1 share = &Rect{
		width:  10,
		height: 5,
		color: "蓝色",
	}
	s1.setColor("红色")
	s := s1.getColor()
	fmt.Printf("s: %v\n", s)
}

```
## OCP 通过接口来实现

OCP是面向对象的可复用设计的第一块基石。是`open closed principle` , 即所谓的`开 - 闭`原则，**对扩展是开放的，对修改是关闭的**

虽然go不是面向对象的语言，但可以模拟这个原则。


下面实现一个宠物接口的例子。
```go{17,23}
package main

import (
	"fmt"
)
type Pet interface {
	eat()
}

type Dog struct {
}
type Person struct {
}
func (dog Dog) eat() {
	fmt.Printf("dog eating ...")
}
func (person Person) keep(p Pet) {
	p.eat()
}
func main() {
	var dog = Dog{}
	var person = Person{}
	person.keep(dog) // dog 实现 Pet 接口，所以可以传入 ，其他宠物也可以
}
```

## OOP的属性和方法

golang没有封装的概念，但是可以通过结构体与函数绑定来实现OOP的属性和方法等特性


结构体与函数的绑定可以看这里介绍 [结构体的方法](./struct#结构体的方法)

结构体可以通过[结构体嵌套](./struct#结构体嵌套)来实现继承功能


## go里面的构造方法