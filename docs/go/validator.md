---
title: validator的使用
description: 文章描述
aside: false
date: 2023-02-06
tags:
	- go
---
# validator 

[validator](https://pkg.go.dev/github.com/go-playground/validator/v10) 是一个数据验证的包

通常我们使用它处理前端发来的字段验证


## 一个简单的验证
加上`validate:"required"` 这个字段变成必填字段

```go{21,13}
package main

import (
	"fmt"
	"github.com/go-playground/validator/v10"
)

// 申明一个validator对象
var validate *validator.Validate

type User struct {
	// 必选
	Name string `validate:"required,min=2,max=10"`
	Age uint `validate:"required,min=2,max=10"`
}
func main() {

	var user = User{}

	validate = validator.New()
	// 验证结构是否符合规则
	err := validate.Struct(user)
	fmt.Printf("err: %v\n", err)
	// 当结构体出错时 err 对象就会存在值
	if err != nil {
		for _, err := range err.(validator.ValidationErrors) {
			// 输出错误信息
			// fmt.Println("Namespace >>>", err.Namespace())
			// fmt.Println("StructNamespace >>>", err.StructNamespace())
			// fmt.Println("StructField >>>", err.StructField())
			// fmt.Println("Tag >>>", err.Tag())
			// fmt.Println("ActualTag >>>", err.ActualTag())
			// fmt.Println("Kind >>>", err.Kind())、
			fmt.Println("Field >>>", err.Field())
			fmt.Println("Type >>>", err.Type())
			fmt.Println("Value >>>", err.Value())
			// fmt.Println("Param >>>", err.Param())
		}
	}
}
```

当验证失败的时候就会输出错误内容

![](https://s2.loli.net/2023/01/04/xSbY5pVDyn1IOuH.png)

## 约束数值长度

```go{14,16}
package main

import (
	"fmt"

	"github.com/go-playground/validator/v10"
)

// 申明一个validator对象
var validate *validator.Validate

type User struct {
	// 必选 长度必须 >=2 <= 10
	Name string `validate:"required,min=2,max=10"`
	// 必选 必须>0 < 130
	Age  uint   `validate:"gte=0,lte=130"`
}

func main() {

	var user = User{
		Name: "t",
		Age: 150,
	}

	validate = validator.New()
	// 验证结构是否符合规则
	err := validate.Struct(user)
	fmt.Printf("err: %v\n", err)
	// 当结构体出错时 err 对象就会存在值
	if err != nil {
		for _, err := range err.(validator.ValidationErrors) {
			fmt.Println("Field >>>", err.Field())
			fmt.Println("Type >>>", err.Type())
			fmt.Println("Value >>>", err.Value())
		}
	}
}
```

抛出错误

![](https://s2.loli.net/2023/01/04/l3YSEgsnLQw2ikB.png)

我们上面已经看到了使用`min`和`max`来约束字符串的长度或数值的范围，范围约束的字段类型有以下几种：
- 对于数值，则约束其值；
- 对于字符串，则约束其长度；
- 对于切片、数组和map，则约束其长度。


其他的内置约束范围字段

|   tag   |                                                              作用                                                               |
| :-----: | :-----------------------------------------------------------------------------------------------------------------------------: |
|  `len`  |                                         限制长度`len=10` ， 对于不同类型参考`max``min`                                          |
|  `eq`   |                                                      限制内容相等`eq=666`                                                       |
|  `ne`   |                                                      不等于参考值`ne=666`                                                       |
|  `gt`   |                                                     大于参数值，例如`gt=10`                                                     |
|  `gte`  |                                                  大于等于参数值，例如`gte=10`                                                   |
|  `lt`   |                                                     小于参数值，例如`lt=10`                                                     |
|  `lte`  |                                                  小于等于参数值，例如`lte=10`                                                   |
| `oneof` | 只能是列举出的值其中一个，这些值必须是数值或字符串，以空格分隔，如果字符串中有空格，将字符串用单引号包围，例如`oneof=red green` |



## 跨字段约束
`validator`允许定义跨字段的约束，即该字段与其他字段之间的关系。


增加`"eqfield=Password"`的验证，限制第二个密码必须要等于第一个密码

```go{9}
type User struct {
	// 必选 长度必须 >=2 <= 10
	Name string `validate:"len=5"`
	// 必选 必须>0 < 130
	Age  uint   `validate:"len=10"`
	// 密码必须至少是10位
	Password  string `validate:"min=10"`
	// 第二个密码必须要等于第一个密码
    Password2 string `validate:"eqfield=Password"`
}
```


## 对于字符串的限制
- `contains=xxx` 必须包含某个字符串
```go
type User struct {
	Name string `validate:"contains=我是"`
}
```
- `excludes=😀` 不包含参数字符串
```go
type User struct {
	Name string `validate:"excludes=😀"`
}
```

- `startswith=xxx` 以参数字符串开头
- `endswith=xxx` 以参数字符串结尾



## 唯一性

使用unqiue来规定唯一性

- 对于数组和切片，unique约束没有重复的元素；
- 对于map，unique约束没有重复的值；
- 对于元素类型为结构体的切片，unique约束结构体对象的某个字段不重复，通过`unqiue=field`指定这个字段名。

```go
type User struct {
	Name string `validate:"min=2"`
	// 限制不允许有相同名字的朋友
	Friends []User `validate:"unique=Name"`
	// 限制不能有相同字符串的爱好
	Likes []string `validate:"unique"`
}

func main() {

	var user1 = User{
		Name: "张三",
	}
	var user2 = User{
		Name: "张三",
	}

	var user3 = User{
		Name:    "王五",
		Friends: []User{user1, user2},
		Likes:   []string{"打篮球", "rap", "rap","唱"},
	}

	validate = validator.New()
	err = validate.Struct(user3)
	if err != nil {
		fmt.Printf("err3: %v\n", err)
	}
}
```
![](https://s2.loli.net/2023/01/04/oCLzB5ja7nUV64M.png)

## 其他
validator 提供了大量内置数据格式验证，如`邮箱` \ `颜色` 等等，具体可以[查看文档](https://pkg.go.dev/github.com/go-playground/validator/v10#readme-baked-in-validations)



## 自定义验证规则
```go{17-23,4}
var validate *validator.Validate
type User struct {
	Name  string `validate:"min=2"`
	Phone int    `validate:"checkPhone"`
}

func main() {

	var user1 = User{
		Name:  "张三",
		Phone: 185222200,
	}

	validate = validator.New()

	// 注册一个自己的验证方式
	_ = validate.RegisterValidation("checkPhone", func(fl validator.FieldLevel) bool {
		val := fl.Field().Int()
		s := strconv.FormatInt(val, 10)
		reg := regexp.MustCompile("^1(3\\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\\d|9[0-35-9])\\d{8}$")
		b := reg.MatchString(s)
		return b
	})

	err := validate.Struct(user1)
	if err != nil {
		fmt.Printf("err1: %v\n", err)
	}
}
```

## 错误处理

validate会返回一个错误对象

```go
err := validate.Struct(user1)
```
err 存在三种情况

1. `nil` = 没有错误
2. `InvalidValidationError` =  输入参数有无
3. `ValidationErrors` = 字段违反了约束
我们可以在程序中判断`err != nil`时，依次将err转换为`InvalidValidationError`和`ValidationErrors`以获取更详细的信息：

```go
func processErr(err error) {
	if err == nil {
		return
	}
	validationError, ok := err.(*validator.InvalidValidationError)
	if ok {
		fmt.Printf("param error:%v", validationError)
		return
	}

	validationErrs := err.(validator.ValidationErrors)
	for _, validationErr := range validationErrs {
		fmt.Printf("validationErr:%v \n", validationErr)
	}
}
```
错误信息基本上是这样的
```
Key: 'User.Phone' Error:Field validation for 'Phone' failed on the 'checkPhone' tag
```

假如我们希望给得到更加友好的提示，就需要设置一个映射来处理错误了

我们可以将这个`validator`封装成一个模块

```go
package validate

import (
	"github.com/go-playground/validator/v10"
	"regexp"
	"strconv"
)

var Validate *validator.Validate

// MessageMap 使用tag作为key来映射一些中文提示
var MessageMap map[string]string = map[string]string{
	"checkPhone": "手机格式不正确",
	"min":        "长度不够",
}

// InitValidate 初始化Validate
func InitValidate() {
	Validate = validator.New()
	_ = Validate.RegisterValidation("checkPhone", checkPhone)
}

// ProcessErr 处理错误信息
func ProcessErr(err error) (errMessage string) {
	if err == nil {
		return ""
	}

	validationErrs := err.(validator.ValidationErrors)

	var message = ""
	for _, validationErr := range validationErrs {
		tag := validationErr.Tag()
		namespace := validationErr.Namespace()

		// 假如存在映射时，将其替换成映射的值
		if MessageMap[tag] != "" {
			tag = MessageMap[tag]
		}
		message += namespace + tag + "\n"
	}

	return message
}

// 确认手机号
func checkPhone(fl validator.FieldLevel) bool {
	val := fl.Field().Int()
	s := strconv.FormatInt(val, 10)
	reg := regexp.MustCompile("^1(3\\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\\d|9[0-35-9])\\d{8}$")
	b := reg.MatchString(s)
	return b
}

```

在`main.go`中使用

```go
package main

import "code1/validate"

func init() {
	// 初始化验证实例
	validate.InitValidate()
}

type User struct {
	Name  string `validate:"min=2"`
	Phone int    `validate:"checkPhone"`
}

func main() {
	user := User{
		Name:  "张",
		Phone: 1775059664701,
	}

	err := validate.Instance.Struct(user)
	errMessage := validate.ProcessErr(err)
	println(errMessage)
}
```

运行后我们就得到了一些相对友好的提示

```
User.Name长度不够
User.Phone手机格式不正确
```




参考文章
- [Go 每日一库之 validator](https://juejin.cn/post/6844904115684802573)





service-customer/manage       
member/exportMemberList


service-provide/manage       
wallet/exportRechargeRecord


service-customer/manage       
wallet/exportWalletList


service-customer/manage       
wallet/exportWalletDetail


service-order/manage       
order/download/orderList


service-order/manage       
orderReport/export/busOrderDetail


service-order/manage       
orderReport/download/orderWalletReportList

