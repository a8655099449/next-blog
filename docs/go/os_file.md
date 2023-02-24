---
title: go的os操作
description: 文章描述
aside: false
date: 2023-01-11
tags:
	- go
---

# os文件操作
os 是指和操作系统相关的一些模块，这章主要讲操作文件 ， [相关文档地址](https://pkg.go.dev/os@go1.19.4#Create)
```go
package main

import (
	"os"
)

// 创建文件
func createFileJson(filename string) {
	_, err := os.Create(filename + ".json")

	if err == nil {
		println(`文件创建成功`)
	} else {
		println(`文件创建失败`)
	}

}

// 创建目录
func makeDir() {
	// 创建单个目录
	err := os.Mkdir("testDir", os.ModePerm)
	if err != nil {
		err.Error()
	}
	//	创建多个目录
	err2 := os.MkdirAll("testDir/b/c/d", os.ModePerm)
	if err2 != nil {
		err.Error()
	}
}

// 删除文件

func delFile() {
	// 删除单个文件或者目录
	// err := os.Remove(`test.json`)
	// 删除目录，以及目录底下所有文件
	err := os.RemoveAll("testDir")

	handleErr(err)
}
func handleErr(err error) {
	if err != nil {
		err.Error()
	}
}

// 获取当前工作目录

func pwd() string {
	dir, _ := os.Getwd()
	return dir
}

// 更改工作目录
func cd(dir string) {

	err := os.Chdir(dir)
	handleErr(err)
}

// 重命名
func rename() {
	err := os.Rename("test.json", "newTest.json")
	handleErr(err)
}

// 写文件
func writeFile() {
	err := os.WriteFile("test.json", []byte(`{"name":"name"}`), os.ModePerm)
	handleErr(err)
}

func readFile() {

	file, _ := os.ReadFile("test.json")

	println(string(file[:]))

}

func open() {

	// 打开一个文件
	//file, _ := os.Open(`test.json`)
	//println(file.Name())
	// 打开一个文件，如果不存在，则创建它 ， 且写入内容为追加，如果不想要则将os.O_APPEND去掉
	file, _ := os.OpenFile(`test1.json`, os.O_RDWR|os.O_CREATE|os.O_APPEND, 755)
	name := file.Name()
	// 写入文件
	file.Write([]byte(`6666667`))
	println(name)

}

func main() {
	//makeDir()
	//delFile()
	//cd("./user")
	//println(pwd())
	//createFileJson("test")
	//time.Sleep(time.Second)
	//rename()
	//createFileJson("test")
	//writeFile()
	open()
}

```