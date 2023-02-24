---
title: 在ts中的关键字
description: 文章描述
aside: false
date: 2023-02-07
tags:
  - typescript
---

# 在ts中的关键字

## keyof

[keyof官方文档解释](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html)

总的来说，就是可以抽取一个对象中的key，来形成一个字符串或者数字的集合

```ts
type Person = {
  name: string;
  age: number;
  gender: number;
};

type Keys = keyof Person

// 等价于
type Keys = 'name' | 'age' | 'gender'

```
## typeof
`typeof`关键字可以在一个已声明的变量中提取出类型

```ts
const name = '张三'  // ts的自动识别类型功能，可以识别name:string
type TName = typeof name // 等价于 TName = string
```
## never

`never`永远不会有返回结果，或者只会抛出错误

具体的作用可以参考这篇文章[ts-never](https://jkchao.github.io/typescript-book-chinese/typings/neverType.html#%E7%94%A8%E4%BE%8B%EF%BC%9A%E8%AF%A6%E7%BB%86%E7%9A%84%E6%A3%80%E6%9F%A5)



## extends
`extends` 关键字在js中也有用到，用于继承一个类，而在ts的类型声明中，也能用到`extends` ,用法在于继承一个类型，而除此之外，extends还有更强大的作用，可以用于做一些判断，比如下面这样：

```ts
type ReverseStringNumber<T> = T extends string ? number : string;
type s = 'string'
type n = ReverseStringNumber<s> // number
```


## infer
`infer` 表示在 `extends` 条件语句中待推断的类型变量


```ts
type ParamType<T> = T extends (arg: infer P) => any ? P : T;

interface User {
  name: string;
  age: number;
}

type Func = (user: User) => void;

type Param = ParamType<Func>; // Param = User
type AA = ParamType<string>; // string
```
[ts -infer](https://jkchao.github.io/typescript-book-chinese/tips/infer.html#%E4%BB%8B%E7%BB%8D)
