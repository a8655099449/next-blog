---
title: go 的数据类型
description: 文章描述
aside: false
date: 2022-12-14
tags:
  - go
---

# go 的数据类型

## 布尔

go里面的布尔类型就是`true` 和 `false`



布尔类型主要就是进行一些逻辑判断，这里面有go和别的语言一个巨大的区别，就是当进行逻辑判断时，go只能使用布尔类型进行判断

![](https://s2.loli.net/2022/12/08/71f2npBQXxmLCvV.png)
## 数字


在go语言中，对于数字，有整型和浮点型的区分。其中还有更加细致的区分，比如位数的区别

![](https://s2.loli.net/2022/12/08/Zarf84VygwqLOIX.png)


## 字符串

### 字符串定义

在go里面，使用`""` 或者 `` 来定义字符串 ,其中反引号代表一个多行字符串

```go

s1 := "hello word"

s2 := `
<div> 
  你好 世界！
</div>
`
fmt.Printf("s1: %v\n", s1)
fmt.Printf("s1: %v\n", s2)
```

### 字符串连接

1. 使用`+`连接
```go
s1 := "hello"
s2 := ` wold`
s3 := s1 + s2 
fmt.Printf("s3: %v\n", s3)
```
2. 使用Sprintf进行模板输出

```go
name := "张三"
age := "20"

s := fmt.Sprintf("name=%s,age=%s", name, age)
fmt.Printf("s: %v\n", s)

```

### 字符串切片

```go
s:= "123456789"

s1 := s[1] // 表示某个字符串的元数据
s2 := s[1:3] // 表示字符串的 第2 - 3 位
s3 := s[3:] // 表示字符串的第三位以后
s4 := s[:5] // 表示字符串的第五位以前

fmt.Printf("s1: %c\n", s1)
fmt.Printf("s2: %v\n", s2)
fmt.Printf("s3: %v\n", s3)
fmt.Printf("s4: %v\n", s4)
```
![](https://s2.loli.net/2022/12/08/zEgZFMSA1vswGro.png)


### 字符串的常用方法

**len** ：获得字符串的长度
```go
s:= "123456789"
l := len(s)
fmt.Printf("l: %v\n", l) // 输出 9 
```
**Split** : 分割字符串

```go
s:= "1,2,3"
s2 := strings.Split(s, ",") // 得到一个数组
fmt.Printf("s2: %v\n", s2) // 输出 [1 2 3] 
```
**Contains** : 是否包含某个字符串

```go
s:= "1,2,3"

b := strings.Contains(s, "2") // 返还true
c := strings.Contains(s, "5") // 返还false
```

**Index** : 返还字符串所在的位置，如果没有返还`-1`


```go
s:= "1,2,3"
b := strings.Index(s, "2") // 返还 2
c := strings.Index(s, "5") // 返还 -1
```

**Replace** : 替换字符串
```go
s:= "1,2,3,1,1,1,1"

s2 := strings.Replace(s, "1", "-1", 2) // 把1替换为-1 ， 2代表匹配到的几个1替换掉
fmt.Printf("s2: %v\n", s2) // => s2: -1,2,3,-1,1,1,1   只替换两个1

```
**ToUpper** : 转换为大写

**ToLower** : 转换为小写

**HasPrefix** : 判断前缀

**HasSuffix** : 判断后缀

```go
strings.HasPrefix(s, "1")
strings.HasSuffix(s, "1")
```

## 数组

数组在go中，是指固定长度相同类型的一段空间


```go
var arr = [3]int{1, 2, 3}
fmt.Printf("arr: %v\n", arr)
```

也可以不指定长度

```go
var arr = [...]int{1, 2, 3}

fmt.Printf("arr: %v\n", arr)
```

## 切片 

切片可以理解为不限长度的数组
```go
var arr = []int{1, 2, 3}

fmt.Printf("arr: %v\n", arr)
```

也可以从数组中进行初始化

```go
var arr = [...]int{1, 2, 3, 4, 5, 6}

var slice1 = arr[:] // 取数组所有值作为切片
var slice2 = arr[2:] // 取索引 2 ~ n 
var slice3 = arr[:3] // 取索引 0 ~ 3-1
var slice4 = arr[2:3] // 取索引 2 ~ 3-1

fmt.Printf("slice1: %v\n", slice1)
fmt.Printf("slice2: %v\n", slice2)
fmt.Printf("slice3: %v\n", slice3)
fmt.Printf("slice4: %v\n", slice4)
```
## 切片和数组的遍历

这两种数据类型，我们都可以使用`for` 或者`for range` 来进行遍历

```go
var lice = []int{1, 2, 3}

for _, v := range lice {
  fmt.Printf("v1: %v\n", v)
}

for i := 0; i < len(lice); i++ {
  var v = lice[i]
  fmt.Printf("v2: %v\n", v)
}
```

## 切片的操作

### 增加
使用**append**在数组的最后添加元素

```go
var lice = []int{1, 2, 3}

lice = append(lice, 4)
lice = append(lice, 5)
fmt.Printf("lice: %v\n", lice)
```

### 删除

删除也是用到了`append`的特性，go里面没有直接的删除方法 ， 下面的例子展示了删除下标为`2`的元素
```go
var lice = []int{1, 2, 3, 4, 5}

lice = append(lice[:2], lice[3:]...)
fmt.Printf("lice: %v\n", lice)
```
### 更新

```go
var lice = []int{1, 2, 3, 4, 5}
lice[0] = 100
fmt.Printf("lice: %v\n", lice)
```

### 复制

```go
var lice = []int{1, 2, 3, 4, 5}

liceCopy := make([]int, len(lice))
copy(liceCopy, lice)

fmt.Printf("liceCopy: %v\n", liceCopy)
```
## map

### 初始化map

```go
var m = map[string]string{
  "name":  "张三",
  "age":   "18",
  "email": "666@qq.com",
}

fmt.Printf("m: %v\n", m)
```
**通过make的方式**


```go
m2 := make(map[string]string)

m2["name"] = `李四` 
m2["age"] = `20` 
m2["email"] = `888@qq.com` 
fmt.Printf("m2: %v\n", m2)
```



### 判断map 某个key 是否存在值

```go
var m = map[string]string{
  "name":  "张三",
  "age":   "18",
  "email": "666@qq.com",
}

var k = `name2`
_,ok := m[k]
fmt.Printf("ok: %v\n", ok)
```
### map的循环


```go

var m = map[string]string{
  "name":  "张三",
  "age":   "18",
  "email": "666@qq.com",
}

for k, v := range m {
  fmt.Printf("k: %v\n", k)
  fmt.Printf("v: %v\n", v)
}
```


## 类型定义和类型别名




**类型定义**
```go{1}
type MySting string
var s MySting = "hello"
fmt.Printf("s: %T\n", s) // s: main.MySting
```

**类型别名**
```go{1}
type MySting = string
var s MySting = "hello"
fmt.Printf("s: %T\n", s) // s: main.string
```
:::tip 它们的区别
类型别名多一个`=`

1. `类型定义`相当于定义了一个全新的类型，与之前的类型不同；但是`类型别名`并没有定义一个新的类型，而是
使用一个别名来替换之前的类型
2. `类型别名`只会在代码中存在，在编译完成之后并不会存在该别名
3. 因为`类型别名`和原来的类型是一致的，所以原来类型所拥有的方法，`类型别名`中也可以调用，但是如果是重
新定义的一个类型，那么不可以调用之前的任何方法
:::







