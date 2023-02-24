---
title: go的其他内容
description: 文章描述
aside: false
date: 2022-12-27
tags:
	- go
---


## os 环境变量

`os.Environ()` 获取所有环境变量

`os.Getenv(key)` 根据key获得某个环境变量

`os.Setenv(key, value)` 设置某个环境变量


## log的类
`log.SetFlags(log.Ltime | log.Ldate | log.Llongfile)` 设置打印的类型

`log.Print(content)`  打印内容

`log.SetPrefix("my log prefix")` 设置打印前缀 


**创建一个log的示例**
```go
package main

import (
	"log"
	"os"
)

func main() {

	file, _ := os.OpenFile("1.log", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0755)

	logger := log.New(file, "", log.Ltime|log.Ldate|log.Llongfile)

	logger.Print("test log")

}
```


## builtin

这个包提供了一些类型申明、变量和常量申明，还要一些遍历函数。这个包不需要导入，这些变量都可以直接使用

[builtin官方文档](https://pkg.go.dev/builtin@go1.19.4)

### append

append是操作切片，[之前在讲到切片](./type.md#切片的操作)的地方有做描述

### len 

获取`字符串`或者`切片`的长度


### print / println

打印函数， `println` 会进行换行输出


### panic

抛出一个异常 然后结束函数


### new 和 make


new和make区别：
1. make只能用来分配及初始化类型为slice,map,chan的数据：new可以分配任意类型的数据
2. new分配返回的是指针，即类型*T;make返回引用，即T:
3. new分配的空间被清零，make分配后，会进行初始化。


## bytes
bytes 包含了对字节切片进行读写的一系列函数

### bytes.Contains 
一个切片是否包含另一个切片


```go
func main() {
	var b1 = []byte("123456")
	var b2 = []byte("123")
	var b3 = []byte("124")
	contains := bytes.Contains(b1, b2)
	println(contains)
	contains = bytes.Contains(b1, b3)
	println(contains)

}

```


### bytes.Count

计算一个字节切片中另一个字节切片出现的**数量**


```go
func main() {

	var b1 = []byte("111223333")
	var b2 = []byte("1")
	var b3 = []byte("2")

	count := bytes.Count(b1, b2)
	println(count)
	count = bytes.Count(b1, b3)
	println(count)

}
```


### bytes.Repeat
重复


```go
func main() {
	var b1 = []byte("123")
	repeat := string(bytes.Repeat(b1, 2))
	println(repeat)
}
```



### bytes.Replace
替换内容，最后一个参数等于替换多少次，如果是`-1`则是替换所有

```go
func main() {
	var b1 = []byte("123")
	var b2 = []byte("2")
	var b3 = []byte("4")
	replace := bytes.Replace(b1, b2, b3, -1)
	println(string(replace))
}
```

 
### bytes.Runes

```go
func main() {
	var b1 = []byte("你好世界")
	var b2 = bytes.Runes(b1)

	i := len(b1)
	println(i) // 12
	i2 := len(b2)
	println(i2) // 4
}
```

## sort

```go
func main() {
	var s1 = []int{2, 3, 1, 5, 4}
	sort.Ints(s1)
	fmt.Printf("%v", s1) // [1 2 3 4 5]
}
```


复杂类型的排序

```go
package main

import (
	"fmt"
	"sort"
)

type testSlice []map[string]int

func (t testSlice) Len() int {
	return len(t)
}

func (t testSlice) Swap(i, j int) {
	t[i], t[j] = t[j], t[i]
}

func (t testSlice) Less(i, j int) bool {
	return t[i]["id"] < t[j]["id"]
}

func main() {

	ls := testSlice{
		{
			"id": 2,
		}, 
		{
			"id": 3,
		}, 
		{
			"id": 1,
		}, 
		{
			"id": 4,
		},
	}
	sort.Sort(ls)
	fmt.Println(ls)
}

```

结构体排序

```go
package main

import (
	"fmt"
	"sort"
)

type Person struct {
	id int
}

type testSlice []Person

func (t testSlice) Len() int {
	return len(t)
}

func (t testSlice) Swap(i, j int) {
	t[i], t[j] = t[j], t[i]
}

func (t testSlice) Less(i, j int) bool {
	return t[i].id < t[j].id
}

func main() {

	ls := testSlice{
		Person{id: 1},
		Person{id: 2},
		Person{id: 5},
		Person{id: 4},
	}
	sort.Sort(ls)
	fmt.Println(ls)
}

```

## time

time 是时间函数 ， [time官方文档链接](https://pkg.go.dev/time@go1.19.4)

### 常用方法
```go
func main() {
	now := time.Now()
	year := now.Year()
	month := now.Month()
	day := now.Day()
	hour := now.Hour()
	minute := now.Minute()
	second := now.Second()
	sprintf := fmt.Sprintf("%d-%02d-%02d %02d:%02d:%02d", year, month, day, hour, minute, second)
	unix := now.Unix() // 获取时间搓

	println(sprintf)
	println(unix)
}

```

### 将时间搓转换时间对象


```go{6}
func main() {

	now := time.Now()

	unix := now.Unix()       // 获取时间搓
	now = time.Unix(unix, 0) // 将时间搓转回来

	year := now.Year()
	month := now.Month()
	day := now.Day()
	hour := now.Hour()
	minute := now.Minute()
	second := now.Second()
	sprintf := fmt.Sprintf("%d-%02d-%02d %02d:%02d:%02d", year, month, day, hour, minute, second)

	println(sprintf)
	println(unix)
}
```



### format函数
`2006-01-02 15:04:05` 是go里面的特殊值，go会自动的替换成当前的时间
```go
package main

import "time"

func main() {
	now := time.Now()

	format := now.Format("2006-01-02 15:04:05")
	println(format)
}

```


## json 解析

将json 转换为 struct 或者 将 struct 转换为 json


### 结构体转换为字符串

```go
package main

import "encoding/json"

type Person struct {
	Name string
	Age  int
}

func main() {
	person := Person{Age: 18, Name: "张三"}
	marshal, _ := json.Marshal(person)
	println(string(marshal))
}
```
:::warning
结构体属性的首字母需要大写，否则无法转换
:::


### json字符串转换为结构体

```go{15}
package main

import (
	"encoding/json"
	"fmt"
)

type Person struct {
	Name string
	Age  int
}

func main() {
	var p Person
	err := json.Unmarshal([]byte(`{"Name":"张三","Age":18}`), &p)
	if err == nil {
		fmt.Printf("%v", p)
	}
}
```

### 从文件中读取json

```go
//从文件读取json

func readJsonByFile() {
	open, _ := os.Open("test.json")

	defer open.Close()
	d := json.NewDecoder(open)
	var v map[string]interface{}
	d.Decode(&v)

	for key, value := range v {
		fmt.Printf("%v:%v\n", key, value)
	}

}
```

## xml 解析

### 将结构体转换为xml字符串
```go

type Person struct {
	Name string
	Age  int
}

func structToXml() {

	person := Person{
		Name: "张三",
		Age:  18,
	}
	// 带有格式的转换
	indent, _ := xml.MarshalIndent(person, "", "  ")
	println(string(indent))

}

```


### xml 转换为结构体

```go
func xmlToStruct() {

	var str = `
	<Person>
	  <Name>张三</Name>
	  <Age>18</Age>
	</Person>
	`
	var b = []byte(str)
	var p Person
	xml.Unmarshal(b, &p)
	fmt.Printf("%v", p)
}
```
