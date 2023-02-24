---
title: go的结构体
description: 文章描述
aside: false
date: 2022-12-14
tags:
	- go
---
# go的结构体

在go中没有面向对象的概念，也就是其他语言中的`对象`、`类`在go中都没有。但是可以使用结构体来实现一些面向对象的特性。比如继承、组合

## 定义结构体
```go
type Person struct {
	name   string
	age    int
	id     int
	gender string
}
```
可以把相同类型的合并成一行
```go
type Person struct {
	name, gender string
	age, id      int
}
```
## 声明结构体变量


```go
var tom Person = Person{
  name:   "tom",
  age:    18,
  id:     1,
  gender: "男",
}

kuangw := Person{
  name: "kuangw",
  age:    20,
  id:     2,
  gender: "男",
}

fmt.Printf("tom: %v\n", tom)
fmt.Printf("kuangw: %v\n", kuangw)
// 访问结构成员
fmt.Printf("kuangw.name: %v\n", kuangw.name)
```


## 匿名结构体
直接声明变量的时候也可以定义成结构体
```go
var dog struct {
  name string
  age  int
}

dog.name = `旺福`
dog.age = 2
```


## 结构体的指针

关于 [指针的介绍](./pointer.md)


**第一种方法**
```go{12}
type Person struct {
  name, gender string
  age, id      int
}
var tom Person = Person{
  name:   "tom",
  age:    18,
  id:     1,
  gender: "男",
}

var pTom *Person = &tom
fmt.Printf("pTom: %p\n", pTom) // 输出 pTom: 0xc0000764b0
```
第二种方法，使用`new`关键字

```go{12,13}
type Person struct {
  name, gender string
  age, id      int
}
var tom Person = Person{
  name:   "tom",
  age:    18,
  id:     1,
  gender: "男",
}

var pTom  = new(Person)
pTom = &tom
fmt.Printf("pTom: %p\n", pTom) // 输出 pTom: 0xc0000764b0
fmt.Printf("pTom: %v\n", *pTom) // 输出 pTom: {tom 男 18 1}
```
### 访问结构指针的成员

跟其他指针的语法不同，通常我们访问指针的值时，需要在变量前面加上`*`号。而访问结构指针成员时，可以省略
```go{3,4}
var pTom = new(Person)
pTom = &tom
pTom.age = 66    // 和下面那行的效果是一样的
(*pTom).age = 66 //
```


## 结构体作为函数的参数
```go{10-13}
package main

import "fmt"

type Person struct {
	name, gender string
	age, id      int
}

func fn(p Person) {
	var name = p.name
	fmt.Printf("name: %v\n", name)
}
func main() {
	var tom Person = Person{
		name:   "tom",
		age:    18,
		id:     1,
		gender: "男",
	}
	fn(tom)
}
```
:::warning
值得注意的是，改变当做参数结构体的值时，不会影响函数外部的值
```go
package main
import "fmt"
type Person struct {
	name, gender string
	age, id      int
}

func fn(p Person) {
	p.name = "李四" // 改变结构体的值
}
func main() {
	var tom Person = Person{
		name:   "tom",
		age:    18,
		id:     1,
		gender: "男",
	}
	fn(tom)
	fmt.Printf("tom.name: %v\n", tom.name) // 输出还是tom
}
```
如果我们想要修改结构体的话，就需要传递指针过去

```go{8,18}
package main
import "fmt"
type Person struct {
	name, gender string
	age, id      int
}

func fn(p *Person) {
	p.name = "李四"
}
func main() {
	var tom Person = Person{
		name:   "tom",
		age:    18,
		id:     1,
		gender: "男",
	}
	fn(&tom)
	fmt.Printf("tom.name: %v\n", tom.name) // 输出李四
}
```
:::

## 结构体嵌套

go语言中没有面向对象的编程思维。但是可以通过结构体嵌套拿来实现这种效果。以下的例子进行展示
```go{12,21-24}
package main
import "fmt"

type Dog struct {
	name string
	age  int
}

type Person struct {
	name, gender string
	age, id      int
	dog          Dog
}

func main() {
	var tom Person = Person{
		name:   "tom",
		age:    18,
		id:     1,
		gender: "男",
		dog: Dog{
			name: "旺财",
			age:  18,
		},
	}
	fmt.Printf("tom: %v\n", tom)
}
```
### 结构体匿名嵌套 

**结构体嵌套我们也可以省略别名**也就是匿名嵌套
```go{13,14,20-29}
package main
import "fmt"
type Animal struct {
	name string
}

type AnimalOtherAttr struct {
	age   int
	color string
}

type Dog struct {
	Animal
	AnimalOtherAttr
	weight string // 虽然这个属性不是匿名，但下面实例的时候依然要匿名
}

func main() {
	
	var dog = Dog{
		Animal{
			name: `小王`,
		},
		AnimalOtherAttr{
			age: 20,
			color: "黑色",
		},
		"500kg", // 必须要声明出所有的属性
	}
	fmt.Printf("dog.animal.name: %v\n", dog.name)
}

```
:::warning 匿名嵌套需要注意的

1. 结构体中的属性，不能重复
2. 实例化结构体时，需要按照顺序依次实例 
:::


## 结构体的方法

Go中的方法，是一种特殊的函数，定义于struct之上（与struct关联、绑定），被称为struct的接受者(receiver)。
通俗的讲，方法就是有接收者的函数。
```go{9-13,20}
package main

import "fmt"

type Person struct {
	name string
	age  int
}
// 函数名字前面加上括号，代表是一个结构体的方法
func (p Person) sayHello() { 
 // 我们可以将这个p的变量理解为this。但go里面不推荐你使用this作为命名
	fmt.Printf(" %v say hello \n", p.name)
}

func main() {
	var tom Person = Person{
		name: "tom",
		age:  18,
	}
	tom.sayHello()
}
```
:::warning 方法的一些注意事项
1. 方法的receiver type并非一定要是struct类型，type定义的类型别名、slice、map、channel、func类型等都可
以
2. struct结合它的方法就等价于面向对象中的类。只不过suc可以和它的方法分开，并非一定要属于同一个文
件，但必须属于同一个包。
3. 方法有两种接收类型：`(T Type)`和`(T *Type)`,它们之间有区别.
4. 方法就是函数，所以Go中没有方法重载(overload)的说法，也就是说同一个类型中的所有方法名必须都唯一。
5. 如果receiver是一个指针类型，则会自动解除引用.
6. 方法和type是分开的，意味着实例的行为(behavior)和数据存储(field)是分开的，但是它们通过receiver建立起
关联关系。
:::

### 方法接受指针

跟结构体的指针概念很像，当我们只接受结构体时，再方法内部访问的结构体是复制出来的，**如果想要使用方法改变结构体的属性，就需要使用指针进行传递**，下面来看一个例子

```go{12}
package main
import (
	"fmt"
)
type Person struct {
	name string
}
func (p Person) changeName() {
	p.name = "王五" // 无效修改
}

func (p *Person) changeName2() {
	p.name = "王五" // 有效修改
}

func main() {
	var zs = Person{
		name: "张三",
	}
	zs.changeName()
	fmt.Printf("zs: %v\n", zs.name) // 还是张三
	zs.changeName2()
	fmt.Printf("zs: %v\n", zs.name) // 变成了王五
}

```