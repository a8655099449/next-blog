---
title: go的包
description: 文章描述
aside: false
date: 2022-12-15
tags:
	- go
---

# go里面的包
包可以区分命令空间（一个文件夹中不能有两个同名文件），也可以更好的管理项目。go中创建一个包，一般是创建一个文件夹，在该文件夹里面的go文件中，使用package关键字声明包名称，通常，文件夹名称和包名称相同。并且，同一个文件下面只有一个包

我们后面会主要使用`go modules`管理go的包

## go modules 

现在go基本都是用[go modules](https://go.dev/blog/using-go-modules)来管理go的包

是go在`1.1.1`中新增加特性，用来管理包的依赖关系


## go module 的使用方法

- 初始化模块
```sh
go mod init<项目模块名称>
```

- 依赖关系处理，根据go.mod文件
```sh
go mod tidy
```

- 将依赖包复制到项目下的vendor目录。
```
go mod vendor
```


> 如果包被屏蔽（墙），可以使用这个命令，随后使用`go build-mod=vendor`编译
- 显示依赖关系
```
go list -m all
```
- 显示详细依赖关系
```
go list -m -json all
```
- 下载依赖
```
go mod download [path@version]
```
[path@version]是非必写的

## 从远程仓库导入

[go官方包管理库](https://pkg.go.dev/)

我们以`gin`这个包为例子

首先我们先在网站搜索这个包 

![](https://s2.loli.net/2022/12/15/2zbeLtZTDmOr5Kj.png)

点击进入这个包的主页，找到下载语句，然后进行下载

![](https://s2.loli.net/2022/12/15/tbqZ23UKeADw89Q.png)

输入指令后等待下载

![](https://s2.loli.net/2022/12/15/n6rKpJuZXF7kPBA.png)

下载成功后，就可以根据gin主页给的例子，来启动一个服务试试了

```go
package main

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"net/http"
)

func main() {
	r := gin.Default()
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
			"code":    200,
		})
	})

	err := r.Run()
	if err != nil {
		fmt.Printf(`服务启动错误了`)
		return
	}
}

```

![](https://s2.loli.net/2022/12/15/pimGQzteOlNq5L3.png)


成功启动了一个服务