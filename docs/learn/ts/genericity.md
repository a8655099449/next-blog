---
title: ts中的内置泛型和类型体操实例
description: 文章描述
aside: false
date: 2023-02-07
tags:
  - typescript
---

# ts中的内置泛型和类型体操实例

## Pick

Pick是选择属性的泛型，第一个参数传入一个类型，第二个参数传入你需要的属性集合，返回一个新的类型

```ts
type Person = {
  name: string;
  age: number;
  gender: number;
};
type PikeType = Pick<Person,'name'|'age'> // 只有name 和 age属性
```

**实现自己的Pick**

```ts
type MyPick<T,K extends keyof T> = {
  [P in K]:T[P]
}
```
## Readonly

Readonly 会将类型的属性变为只读属性

**实现**

```ts
type MyReadOnly<T> = {
  readonly [K in keyof T]: T[K];
};
```

## 将元祖转换为对象
[github地址](https://github.com/type-challenges/type-challenges/blob/main/questions/00011-easy-tuple-to-object/README.zh-CN.md)

```ts
type TupleToObject<T extends readonly any[]> = {
  [K in T[number]]: K;
};
```


## 第一个对象
实现一个通用`First<T>`，它接受一个数组T并返回它的第一个元素的类型。

## 获取元组的长度

[github链接](https://github.com/type-challenges/type-challenges/blob/main/questions/00018-easy-tuple-length/README.zh-CN.md)
```ts
type Length<T extends readonly any[]> = T['length']
```

## Awaited
`Awaited` 可以提取Promise函数中的返回值，参数传入一个Promise的类型值

```ts
type Person = {
  name: string;
  age: number;
};
type Result1 = Awaited<Promise<string>>; // string
type Result2 = Awaited<Promise<Person>>; // Person
```
**实现Awaited**
```ts
type MyAwaited<T> = T extends Promise<infer P>
  ? P extends Promise<unknown>
    ? MyAwaited<P>
    : P
  : never;
```
## 判断两个类型是否一样 Equal

```ts
type Equal<L, R> = (<T>() => T extends L ? 1 : 2) extends (<T>() => T extends R
  ? 1
  : 2)
  ? true
  : false;
```
## 提取出函数中，参数的类型 ，Parameters

```ts
const foo = (arg1: string, arg2: number): void => {};
type FunctionParamsType = Parameters<typeof foo>; // [arg1: string, arg2: number]
```
**实现Parameters**

```ts
type MyParameters<T extends (...args: any[]) => unknown> = T extends (
  ...args: infer U
) => unknown
  ? U
  : never;
```

## 获取函数返回类型 ReturnType

```ts
const foo = () => {
  return {
    age: 10,
    name: "张三",
  };
};
type a = MyReturnType<typeof foo>; // { name:string , age:number }
```


**实现ReturnType**
```ts
type MyReturnType<T extends (...args: any) => any> = T extends (
  ...args: any
) => infer R
  ? R
  : never;
```

## Omit

Omit的作用是，在一个类型中，忽略掉某些Key

**实现Omit**

```ts
type MyOmit<T, K extends keyof T> = {
  [P in Exclude<keyof T, K>]: T[P];
};
```
## ReadonlyByKeys


一个通用的readonly ，可以在第一个参数中传入keys ，将传入的属性名转换为只读实现，如果不传，则将所有属性转换为只读属性

```ts
type ReadonlyByKeys<T, K extends keyof T = keyof T> = {
  [P in Exclude<keyof T,K>]: T[P];
} & {
  readonly [P in keyof T]: T[P];
};
```
:::tip
这里面的技巧是，利用联合类型的特性,当同样的属性，后者没有`readonly`特性而前者有时，readonly特性消失
:::

## 深度的ReadOnly
将一个类型的所有属性，及属性的子属性，都变为只读属性
```ts
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends never ? never : DeepReadonly<T[P]>;
};
```
这里面主要的解题思路在于递归

## 元组转合集
```ts
type Arr = ['1', '2', '3']

type TupleToUnion<T extends readonly any[]> = T[number]
type Test = TupleToUnion<Arr> // expected to be '1' | '2' | '3'
```

## 可串联构造器
<<<<<<< Updated upstream
Pick是一个过滤器，可以在第二个参数中过滤出你想要的key名，然后返回一个新的类型
```ts
type Person = {
  name:string,
  age:number,
  gender:number
}

type Something = Pick<Person,'name'> // 只拥有name属性
```



## 获取元组的长度

[github链接](https://github.com/type-challenges/type-challenges/blob/main/questions/00018-easy-tuple-length/README.zh-CN.md)
```ts
type Length<T extends readonly any[]> = T['length']
```

## Awaited
`Awaited` 可以提取Promise函数中的返回值，参数传入一个Promise的类型值

```ts
type Person = {
  name: string;
  age: number;
};
type Result1 = Awaited<Promise<string>>; // string
type Result2 = Awaited<Promise<Person>>; // Person
```
**实现Awaited**
```ts
type MyAwaited<T> = T extends Promise<infer P>
  ? P extends Promise<unknown>
    ? MyAwaited<P>
    : P
  : never;
```
## 判断两个类型是否一样 Equal

```ts
type Equal<L, R> = (<T>() => T extends L ? 1 : 2) extends (<T>() => T extends R
  ? 1
  : 2)
  ? true
  : false;
```
## 提取出函数中，参数的类型 ，Parameters

```ts
const foo = (arg1: string, arg2: number): void => {};
type FunctionParamsType = Parameters<typeof foo>; // [arg1: string, arg2: number]
```
**实现Parameters**

```ts
type MyParameters<T extends (...args: any[]) => unknown> = T extends (
  ...args: infer U
) => unknown
  ? U
  : never;
```

## 获取函数返回类型 ReturnType

```ts
const foo = () => {
  return {
    age: 10,
    name: "张三",
  };
};
type a = MyReturnType<typeof foo>; // { name:string , age:number }
```


**实现ReturnType**
```ts
type MyReturnType<T extends (...args: any) => any> = T extends (
  ...args: any
) => infer R
  ? R
  : never;
```

## Omit

Omit的作用是，在一个类型中，忽略掉某些Key

**实现Omit**

```ts
type MyOmit<T, K extends keyof T> = {
  [P in Exclude<keyof T, K>]: T[P];
};
```
## ReadonlyByKeys


一个通用的readonly ，可以在第一个参数中传入keys ，将传入的属性名转换为只读实现，如果不传，则将所有属性转换为只读属性

```ts
type ReadonlyByKeys<T, K extends keyof T = keyof T> = {
  [P in Exclude<keyof T,K>]: T[P];
} & {
  readonly [P in keyof T]: T[P];
};
```
:::tip
这里面的技巧是，利用联合类型的特性,当同样的属性，后者没有`readonly`特性而前者有时，readonly特性消失
:::

## 深度的ReadOnly
将一个类型的所有属性，及属性的子属性，都变为只读属性
```ts
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends never ? never : DeepReadonly<T[P]>;
};
```
这里面主要的解题思路在于递归

## 元组转合集
```ts
type Arr = ['1', '2', '3']

type TupleToUnion<T extends readonly any[]> = T[number]
type Test = TupleToUnion<Arr> // expected to be '1' | '2' | '3'
```

## 可串联构造器
