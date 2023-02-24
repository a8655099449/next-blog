---
title: go格式化输出
description: 文章描述
aside: false
date: 2022-12-12
tags:
	- go
---

# 格式化输出

| 内容  |            含义            |                          示例                           |
| :---: | :------------------------: | :-----------------------------------------------------: |
| `%v`  | 代表`var`,相应值的默认格式 | ![](https://s2.loli.net/2022/12/09/JKP4mb1I7rMcqUl.png) |
| `%#v` | 相对于`%v`有额外的结构输出 | ![](https://s2.loli.net/2022/12/09/Tl641xUOtNo7AsE.png) |
| `%T`  |          输出类型          | ![](https://s2.loli.net/2022/12/09/olRZbXc1DwK8vqm.png) |
| `%t`  |        输出布尔类型        |              `fmt.Printf("b: %t\n", true)`              |
| `%p`  |        输出指针类型        | ![](https://s2.loli.net/2022/12/09/Tc6LCvobw9WjKX8.png) |


**整数占位符**


| 内容  |       含义       |                示例                 |
| :---: | :--------------: | :---------------------------------: |
| `%b`  |    二进制表示    | `fmt.Printf("%b\n", 5)  // 输出101` |
| `%d`  |    十进制表示    |                                     |
| `%o`  |    八进制表示    |                                     |
| `%x`  | 小写的16进制表示 |                                     |




## go的循环运算符

go里面只有`for` 和 `for range`
```go
for i := 0; i < 10; i++ {
  fmt.Printf("i: %v\n", i)
}

arr := [...]int  {1,1,3}
for _, v := range arr {
  fmt.Printf("v: %v\n", v)
}
```
`for range`  有点类似于 `js`中的 `for in` ,可以遍历 数组 、 字符串 、 map 、 切片 、 通道 。返回有以下的规律

1. 数组 、 字符串 、 切片 返还索引和值
2. map 返回键和值
3. 通道，只返回通道内的值




## 条件运算符
`if else` 为go的条件运算符，和其他语言基本相同，只需要注意以下的几个问题

1. if 后面不需要跟括号
2. if 后面的语句必须要返回的必须要是一个布尔值’
3. if 和 `{` 必须要在同一行

以下的三种都有错误

![](https://s2.loli.net/2022/12/09/2y71c9qZdu68MPA.png)


 

**下面是关键字模块**
## **break**

`break` 可以结束 `for` \ `switch` \ `select` 的代码块


![](https://s2.loli.net/2022/12/09/y2oGnZCLYmOt4UH.png)
## continue

 **continue**  ： 结束本次循环，继续下一次



##  **goto**

`goto`关键字可以跳转到一个标签 ,并且结束当前的代码块

```go
func main() {

	for i := 0; i < 10; i++ {

		if i == 6 {
			goto END
		}
		fmt.Printf("i: %v\n", i)
	}
END:
	fmt.Printf("end...")
}
```

而且 `goto` 还可以结束多重for循环 ,  而break只能结束当前这次的for循环


```go
func main() {

	for i := 0; i < 10; i++ {

		for j := 0; j < 10; j++ {

			if i == 1 && j == 2 {
				goto END
			}	
			fmt.Printf("i: %v  j:%v\n", i ,j)
		}
	}
END:
	fmt.Printf("end...")

}
```

## defer(延迟) 

go语言中 `defer` 会将后面跟随的语句进行延迟处理
### defer 的特性

1. 关键字defer用于注册延迟调用.
2. 这些调用直到return前才被执。因此，可以用来做资源清理。
3. 多个defer语句，按先进后出的方式执行。
4. defer语句中的变量，在defer声明时就决定了。


### defer用途
1. 关闭文件句柄
2. 锁资源释放
3. 数据库连接释放


![](https://s2.loli.net/2022/12/11/5dzuXgAmaJ9pyMs.png)
