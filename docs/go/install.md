---
title: go的安装
description: 文章描述
aside: false
date: 2022-12-12
tags:
	- go
---
# go的安装与hello word

## go的安装

我们直接在[go的官网](https://go.dev/)下载安装包，按照自己系统类型

![](https://s2.loli.net/2022/12/07/CpKRa7znYyL9FBl.png)

下载完后，直接运行安装包就可以了，傻瓜式安装

然后运行 `go version` 查看是否安装成功

![](https://s2.loli.net/2022/12/07/RNCer5M9iEk4udJ.png)


## 配置环境变量

安装完后需要配置go的环境变量，这里我使用的是win11的操作系统

`GOROOT` => GO的安装目录 （可能已经存在，如果存在则不需要再添加了）

`GOPATH` => GO的代码路径 （需要我们自行添加）


![](https://s2.loli.net/2022/12/07/k3N5SicuETWYVGI.png)


## 安装 goland
goland 是go 语言开发的一个编辑器，当然我们也可以使用vscode进行go开发，都是可以的，下面介绍goland的安装和激活


[golang下载地址](https://www.jetbrains.com/go/)

安装包下载完后直接傻瓜式安装

然后下载破解工具

链接：https://pan.baidu.com/s/1fCyl7H9C6g_njFudhK6UTA?pwd=zl1t 

提取码：zl1t 


**golang的激活码**，在我写本文时亲测可以激活

```
PSUYBOSE34-eyJsaWNlbnNlSWQiOiJQU1VZQk9TRTM0IiwibGljZW5zZWVOYW1lIjoia2lkZHkgaW5zZWFtcyIsImFzc2lnbmVlTmFtZSI6IiIsImFzc2lnbmVlRW1haWwiOiIiLCJsaWNlbnNlUmVzdHJpY3Rpb24iOiIiLCJjaGVja0NvbmN1cnJlbnRVc2UiOmZhbHNlLCJwcm9kdWN0cyI6W3siY29kZSI6IlBTSSIsImZhbGxiYWNrRGF0ZSI6IjIwMjUtMDgtMDEiLCJwYWlkVXBUbyI6IjIwMjUtMDgtMDEiLCJleHRlbmRlZCI6dHJ1ZX0seyJjb2RlIjoiUENXTVAiLCJmYWxsYmFja0RhdGUiOiIyMDI1LTA4LTAxIiwicGFpZFVwVG8iOiIyMDI1LTA4LTAxIiwiZXh0ZW5kZWQiOnRydWV9LHsiY29kZSI6IkdPIiwiZmFsbGJhY2tEYXRlIjoiMjAyNS0wOC0wMSIsInBhaWRVcFRvIjoiMjAyNS0wOC0wMSIsImV4dGVuZGVkIjpmYWxzZX0seyJjb2RlIjoiUEdPIiwiZmFsbGJhY2tEYXRlIjoiMjAyNS0wOC0wMSIsInBhaWRVcFRvIjoiMjAyNS0wOC0wMSIsImV4dGVuZGVkIjp0cnVlfSx7ImNvZGUiOiJQV1MiLCJmYWxsYmFja0RhdGUiOiIyMDI1LTA4LTAxIiwicGFpZFVwVG8iOiIyMDI1LTA4LTAxIiwiZXh0ZW5kZWQiOnRydWV9XSwibWV0YWRhdGEiOiIwMTIwMjIwODAxUFNBTjAwMDAwNSIsImhhc2giOiJUUklBTDotNTIzMzE4Njc5IiwiZ3JhY2VQZXJpb2REYXlzIjo3LCJhdXRvUHJvbG9uZ2F0ZWQiOmZhbHNlLCJpc0F1dG9Qcm9sb25nYXRlZCI6ZmFsc2V9-JWZKP0AJWKSXcl1Ep6poGhauD7GlLMbPVMompa2zVsDzjP2L82BvMo0RZTPYcGiLnP7YL7kHUNFrn2wJiNlXVwp9AnXUvVTspDqhf5MwZ/W0Aug0HpJB0BVSPM7KRL41wyN2DHGyvRJ/w4/s057IQEZWUUy2HUUM1E48WqezS7HlKQBVrrD+IFjHE2Xv4xaPt/KBFXTn+MwWBiYcKsIdDurNKjHdRwo/Gl0umRc8/CFMYK6nrgoWA13PAgHMZioQPc4DK2aVCbCDECpTGoMIsKl2jZJei+wPfOf9Ud9i0/95YEyoK8/XnkUBzsm19quFegTEVp3HhT/EMheCuvMmeQ==-MIIETDCCAjSgAwIBAgIBDTANBgkqhkiG9w0BAQsFADAYMRYwFAYDVQQDDA1KZXRQcm9maWxlIENBMB4XDTIwMTAxOTA5MDU1M1oXDTIyMTAyMTA5MDU1M1owHzEdMBsGA1UEAwwUcHJvZDJ5LWZyb20tMjAyMDEwMTkwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCUlaUFc1wf+CfY9wzFWEL2euKQ5nswqb57V8QZG7d7RoR6rwYUIXseTOAFq210oMEe++LCjzKDuqwDfsyhgDNTgZBPAaC4vUU2oy+XR+Fq8nBixWIsH668HeOnRK6RRhsr0rJzRB95aZ3EAPzBuQ2qPaNGm17pAX0Rd6MPRgjp75IWwI9eA6aMEdPQEVN7uyOtM5zSsjoj79Lbu1fjShOnQZuJcsV8tqnayeFkNzv2LTOlofU/Tbx502Ro073gGjoeRzNvrynAP03pL486P3KCAyiNPhDs2z8/COMrxRlZW5mfzo0xsK0dQGNH3UoG/9RVwHG4eS8LFpMTR9oetHZBAgMBAAGjgZkwgZYwCQYDVR0TBAIwADAdBgNVHQ4EFgQUJNoRIpb1hUHAk0foMSNM9MCEAv8wSAYDVR0jBEEwP4AUo562SGdCEjZBvW3gubSgUouX8bOhHKQaMBgxFjAUBgNVBAMMDUpldFByb2ZpbGUgQ0GCCQDSbLGDsoN54TATBgNVHSUEDDAKBggrBgEFBQcDATALBgNVHQ8EBAMCBaAwDQYJKoZIhvcNAQELBQADggIBABqRoNGxAQct9dQUFK8xqhiZaYPd30TlmCmSAaGJ0eBpvkVeqA2jGYhAQRqFiAlFC63JKvWvRZO1iRuWCEfUMkdqQ9VQPXziE/BlsOIgrL6RlJfuFcEZ8TK3syIfIGQZNCxYhLLUuet2HE6LJYPQ5c0jH4kDooRpcVZ4rBxNwddpctUO2te9UU5/FjhioZQsPvd92qOTsV+8Cyl2fvNhNKD1Uu9ff5AkVIQn4JU23ozdB/R5oUlebwaTE6WZNBs+TA/qPj+5/we9NH71WRB0hqUoLI2AKKyiPw++FtN4Su1vsdDlrAzDj9ILjpjJKA1ImuVcG329/WTYIKysZ1CWK3zATg9BeCUPAV1pQy8ToXOq+RSYen6winZ2OO93eyHv2Iw5kbn1dqfBw1BuTE29V2FJKicJSu8iEOpfoafwJISXmz1wnnWL3V/0NxTulfWsXugOoLfv0ZIBP1xH9kmf22jjQ2JiHhQZP7ZDsreRrOeIQ/c4yR8IQvMLfC0WKQqrHu5ZzXTH4NO3CwGWSlTY74kE91zXB5mwWAx1jig+UXYc2w4RkVhy0//lOmVya/PEepuuTTI4+UJwC7qbVlh5zfhj8oTNUXgN0AOc+Q0/WFPl1aw5VV/VrO8FCoB15lFVlpKaQ1Yh+DVU8ke+rt9Th0BCHXe0uZOEmH0nOnH/0onD
```


## vscode 开发go

VScode 也是能够进行go语言开发的，但可能遇到一点小问题，我们首先需要安装go语言的扩展，我在安装的时候就遇到了安装失败的问题

可以输入以下的命令

```sh
go env -w GO111MODULE=on
go env -w GOPROXY=https://goproxy.cn,direct
```



## hellow word
新建一个 `hellow.go`的文件，再输入以下的内容

```go
// 包名
package main
// 引入一个包
import "fmt"

func main() {
  // 打印
	fmt.Printf(`hellow word`)
}
```

完后，输入`go run hellow.go` 就可以看到输出了

![](https://s2.loli.net/2022/12/07/3qTIALHOwBFNpix.png)



## go 的一个简单模块化

### 初始化项目

这次我们模拟一次go的项目初始化,输入以下的指令

```sh
mkdir code2
cd code2
go mod init code2
new-item main.go -type file
mkdir user
cd .\user\
new-item user.go -type file
```
大概出现一个这样的文件结构

![](https://s2.loli.net/2022/12/07/ibzolqYXR9DC5EM.png)

`user.go`中，输入如下

```go
package user
// 在user模块中，定义一个hello函数
func Hello() string {
	return `Hello`
}
``` 

`main.go`中
```go
package main

import (
	"code1/user" // 导入user模块
	"fmt"
)

func main() {
	s := user.Hello()
	fmt.Printf("s: %v\n", s) // 打印hello
}
```

输入 `go run main.go` 查看运行结果


![](https://s2.loli.net/2022/12/07/qJ2HQ9rmfihkPWF.png)


## 声明变量

声明变量有几个前提

1. 只能以字母或者`_`开头
2. 不能使用关键字作为变量名
3. 声明后必须使用，否则会报错

声明的格式

```go
var identifier type = 666
声明关键字  变量名 类型  = 赋值（可以不赋值）
```

### 批量申明变量

```go
var (
  name string
  age int 
  gender bool
)
fmt.Printf("name: %v\n", name)
fmt.Printf("age: %v\n", age)
fmt.Printf("gender: %v\n", gender)
```
**批量初始化 + 赋值**
> 可以不用定义类型，go会根据赋值的类型，自动推算类型
```go
var name , age , gender = `tom` , 20 , `男`

fmt.Printf("name: %v\n", name)
fmt.Printf("age: %v\n", age)
fmt.Printf("gender: %v\n", gender)
```

### 短变量声明

短变量声明相当简洁，可能也是我们后面最常用到的声明方式。


```go
num1 := 66
```
这种声明不需要使用关键字，也不需要定义类型，直接赋值就行了， 但也有限制
1. 不能再函数外进行声明
2. 必须要赋值


## 匿名变量
比如说有这种情况，一个函数有两个返回值，但是你只想用到其中的一个,但这样是会报错的。

![](https://s2.loli.net/2022/12/07/hKlrCX4xP5IwBFi.png)

使用一个`_`当作匿名变量，来接受我们不想要的值

![](https://s2.loli.net/2022/12/07/nk1rNAHfKTvoQye.png)

匿名变量的数量是不受限制的

## 常量

常量顾名思义是无法更改的值，在几乎任何一种语言中都有这样的概念。

常量和变量有以下的几个特点

1. 使用`const` 作为关键字
2. 必须要赋值
3. 赋值完后不能修改

## iota

iota 是一个特殊的常量，它会在编译阶段可以被修改，

初始值是0

每次遇到常量时 +1 ,让我们来看下面的案例
```go
func main() {

	const (
		a1 = iota
		a2 = iota
		a3 = iota
	)

	fmt.Printf("a1: %v\n", a1)
	fmt.Printf("a1: %v\n", a2)
	fmt.Printf("a1: %v\n", a3)
}
```

![](https://s2.loli.net/2022/12/07/oZH1siCBlvcgRAW.png)

可以使用 `_` 跳过某一次的自增

![](https://s2.loli.net/2022/12/07/RYCcUyBuQISjTsz.png)

### iota 中间插队
中间插队的概念和