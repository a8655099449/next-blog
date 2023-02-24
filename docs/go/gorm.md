---
title: gorm的使用
description: 文章描述
aside: false
date: 2023-02-07
tags:
	- go
---

# gorm

gorm是go语言中热门的`ORM`库
> ORM全称是：Object Relational Mapping(对象关系映射)，其主要作用是在编程中，把面向对象的概念跟数据库中表的概念对应起来。

相关连接
- [gorm中文文档](https://gorm.io/zh_CN/docs/index.html)

下面的将使用mysql当作例子,GORM 官方支持的数据库类型有：` MySQL, PostgreSQL, SQlite, SQL Server`

## 安装

```
go get -u gorm.io/gorm
go get -u gorm.io/driver/mysql
```


## 配置文件
在连接之前我们先把数据库的文件建立一个配置文件，方便管理

新建文件`config/application.yml`，填充内容：
```js
# 数据库配置
datasource:
  driverName: mysql
  host: "127.0.0.1"
  port: "3306"
  database: go_db
  username: root
  password: 123456
  charset: utf8mb4
  loc: Asia/Shanghai
```

下载`viper`来读取配置的的内容
```
go get github.com/spf13/viper
```
新建文件`common/config.go`,填充内容：

```go
package common

import (
	"github.com/spf13/viper"
	"log"
	"os"
	"path"
)

func InitConfig() {
	log.Print(`配置开始初始化....`)
	workDir, _ := os.Getwd()
	viper.SetConfigName("application")
	viper.SetConfigType("yml")
	viper.AddConfigPath(path.Join(workDir, "config"))

	err := viper.ReadInConfig()
	if err != nil {
		log.Print(`配置初始化失败`)
		panic(err)
	} else {
		log.Print(`配置初始化成功`)
	}
}
```
## 连接数据库
开始连接数据库，新建文件`common/database.go`


```go
package common

import (
	"fmt"
	"github.com/spf13/viper"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"log"
	"net/url"
)

var DB *gorm.DB

func init() {

	// 初始化配置文件
	InitConfig()
	// 初始化数据库
	InitDataBase()
}

func InitDataBase() *gorm.DB {
	host := viper.GetString("datasource.host")
	port := viper.GetString("datasource.port")
	database := viper.GetString("datasource.database")
	username := viper.GetString("datasource.username")
	password := viper.GetString("datasource.password")
	charset := viper.GetString("datasource.charset")
	loc := viper.GetString("datasource.loc")

	sqlStr := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=%s&parseTime=true&loc=%s",
		username,
		password,
		host,
		port,
		database,
		charset,
		url.QueryEscape(loc))
	db, err := gorm.Open(mysql.Open(sqlStr))

	if err != nil {
		panic("打开数据库失败" + err.Error())
		return nil
	} else {
		log.Print("数据库连接成功")
	}
	DB = db
	return db
}
```
在`main.go`里面引入

```go
package main

import (
	_ "code1/common"
)

func main() {

}
```

看到以下的输出说明已经连接数据库成功了

![](https://s2.loli.net/2023/01/05/JvU5PwxY2Mb3SD9.png)


## 配置模型

新建文件`model/user.go`

```go
package model

import "gorm.io/gorm"

type User struct {
	gorm.Model
	Name     string `gorm:"type:varchar(50);not null;unique;comment:用户名"`
	Age      uint   `gorm:"type:tinyint(10);comment:年龄"`
	Account  string `gorm:"type:varchar(50);not null;comment:账号"`
	Password string `gorm:"type:varchar(100);not null;comment:密码"`
}
// 这里定义的是表名
func (receiver User) TableName() string {
	return `user_1`
}
```
更改`main.go`中的内容，调用[AutoMigrate](https://gorm.io/zh_CN/docs/migration.html)来初始化模型


```go
package main

import (
	"code1/common"
	"code1/model"
)

func main() {
	_ = common.DB.AutoMigrate(model.User{})
}
```
:::tip AutoMigrate的作用
`AutoMigrate` 会创建表、缺失的外键、约束、列和索引。 如果大小、精度、是否为空可以更改，则 `AutoMigrate` 会改变列的类型。 出于保护您数据的目的，它不会删除未使用的列
:::

可以看到一张新的表被自动创建出来了

![](https://s2.loli.net/2023/01/05/ftpZFOKqRubjrds.png)

## crud


### 增加记录

```go{3}
// 添加一条记录
func insert() {
	tx := common.DB.Create(&model.User{
		Name:     "kuangw",
		Age:      18,
		Account:  "kuangw11",
		Password: "123456",
	})

	if tx.RowsAffected > 0 {
		log.Print(`添加数据`)
	} else {
		log.Printf(`添加数据失败%v`, tx.Error)
	}
}
```
![](https://s2.loli.net/2023/01/05/3iKusF78JDNU6Sa.png)

新的数据已经被创建出来了


### 查找数据

**根据主键查找**
```go{9}
func main() {
	_ = common.DB.AutoMigrate(model.User{})
	u := findById(1)
}

// 根据主键查找
func findById(id int) (u model.User) {
	var user model.User
	common.DB.First(&user, id)
	return user
}
```
**根据条件查找**

```go
// 根据用户名查找
func findByName(name string) (user model.User) {
	common.DB.First(&user, "name = ?", name)
	return user
}
```

### 更新数据

更新单个字段
```go{9}
func main() {
	_ = common.DB.AutoMigrate(model.User{})

	u := findById(1)
	updateUserName(&u, "newName")
}
// 更新用户名
func updateUserName(user *model.User, name string) {
	common.DB.Model(user).Update("name", name)
}
```
可以看到字段`name`已经被更新了

![](https://s2.loli.net/2023/01/05/ytnrCmgAH89WQOL.png)

更新多个字段

```go{12}
func main() {
	_ = common.DB.AutoMigrate(model.User{})
	u := findById(1)
	updateUser(&u, model.User{
		Name: "张三",
		Age:  32,
	})
}

// 更新整个用户对象
func updateUser(user *model.User, newUser model.User) {
	common.DB.Model(user).Updates(newUser)
}
```


最后我们把方法封装到model里面

:::details
```go
package model

import (
	"code1/common"
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Name     string `gorm:"type:varchar(50);not null;unique;comment:用户名"`
	Age      uint   `gorm:"type:tinyint(10);comment:年龄"`
	Account  string `gorm:"type:varchar(50);not null;comment:账号"`
	Password string `gorm:"type:varchar(100);not null;comment:密码"`
}

// TableName 表名
func (user *User) TableName() string {
	return `user_1`
}

// Create 创建用户
func (user *User) Create() {
	common.DB.Create(&user)
}

// CrateUsers 批量创建用户
func CrateUsers(users *[]User) *gorm.DB {
	return common.DB.Create(&users)
}

// FindById 根据id查找用户
func FindById(id int) (user User) {
	// 根据主键查找
	common.DB.First(&user, id)
	return user
}

func FindAll() []User {
	var users []User
	common.DB.Find(&users)
	return users
}

// Delete 删除用户
func (user *User) Delete() {
	common.DB.Delete(&user)
}

// Update 更新用户
func (user *User) Update(newUser User) *gorm.DB {
	return common.DB.Model(user).Updates(newUser)
}
```
:::
