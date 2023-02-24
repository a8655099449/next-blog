---
title: gin 的使用
description: 文章描述
aside: false
date: 2023-02-07
tags:
	- go
---

# gin 的使用

Gin是一个使用Go语言开发的Web框架。 [中文文档地址](https://gin-gonic.com/zh-cn/)


## 下载
```
go get -u github.com/gin-gonic/gin
```

## 启动一个服务
新建文件`common/server.go` , 填充内容
```go
package common

import (
	"github.com/gin-gonic/gin"
	"log"
)

var App *gin.Engine

// RunServer 启动服务器
func RunServer() {
	App = gin.Default()
	// 跑在3000端口
	err := App.Run(":3000")
	if err == nil {
		log.Println("服务器启动成功")
	} else {
		log.Println("服务启动失败", err.Error())
	}
}

```

## 获取参数

1. 获取query参数

获取类似这种参数`/user/delete?id=5`
```go{2}
func delUser(c *gin.Context) {
	id := c.Query("id")
	common.ResponseSuccess(c, id)
}
```

2. 获取params参数

`/user/delete/:id`

```go{2}
func delUser(c *gin.Context) {
	id := c.Param("id")
	common.ResponseSuccess(c, id)
}
```

3. 获取body参数
```go{3,4}
func delUser(c *gin.Context) {
	var user model.APIUser
	data, _ := c.GetRawData()
	_ = json.Unmarshal(data, &user)
	common.ResponseSuccess(c, user)
}
```

4. 获得header
```go{2}
func delUser(c *gin.Context) {
	token := c.Request.Header["Token"][0]
	common.ResponseSuccess(c, token)
}
```
