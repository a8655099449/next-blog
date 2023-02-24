---
title: js面试题
description: 文章描述
aside: false
date: 2023-02-07
tags:
  - 面试
---

## 什么是变量提升？

在早期的就是中，变量可以提前被被声明，可以看以下的示例

```js
console.log(a) // 输出undefined而不是报错，虽然声明a的语句在下面，但a已经被提前声明了
var a = 10
```

但这个也仅限于`var`声明的变量，es6的 `let 、const`就不支持变量提升

## `toLowerCase` 和 `toLocaleLowerCase` 区别是什么？

toLocaleLowerCase 针对一些特殊地区的字符做一些处理比如说土耳其语有特殊的小写方式

## `['1', '2', '3'].map(parseInt)` 会输出什么 为什么

输出结果  <br>
`[1,NaN,NaN]`

原因 

parseInt接受两个参数 `parseInt(string, radix)` ,第一个参数没啥好说的，但第二个参数 `radix` 是2-36之间的整数，表示被解析字符串的基数。

所以当map的第二个参数 index被传入的时候，因为解析不了，就会出现NaN的情况，map输出的结果其实是这样。 [parseInt MDN文档](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/parseInt)

```js
[
  parseInt('1',0),
  parseInt('2',1),
  parseInt('3',2),
]  === [1,NaN,NaN]
```

## 什么是防抖和节流？有什么区别？如何实现？

关于这个问题，请参考 `我另一篇文章【节流与防抖】`


##  Set、Map、WeakSet 和 WeakMap 的区别？

[这个问题可以先参考这篇文档](https://es6.ruanyifeng.com/#docs/set-map)


### Set

1. 成员不能重复
2. 只有键值，没有键名，类似于数组
3. 可以遍历，方法有`add, delete,has`
```js
const s = new Set ([1,2,3,1,2,3])
console.log(s); // 输出 {1,2,3}
```
### weakSet
1. 成员只能是对象
2. WeakSet的对象都是弱引用，随时可以消失，不容易造成内存泄漏
3. 不能遍历

### Map

1. 本质上是键值对的集合，类似集合
2. 可以遍历


### weakMap

1. 可以且只能接受对象作为键名
2. 键名所指向的对象，不计入垃圾回收机制
3. 不能遍历，方法同get,set,has,delete


## 以下代码的执行顺序

```js
async function async1() {
    console.log('async1 start');
    await async2();
    console.log('async1 end');
}
async function async2() {
    console.log('async2');
}
console.log('script start');  
setTimeout(function() {
    console.log('setTimeout');
}, 0)
async1();
new Promise(function(resolve) {
    console.log('promise1');
    resolve();
}).then(function() {
    console.log('promise2');
});
console.log('script end');
```
正确的输出结果
```js
'script start'    
'async1 start'
'async2'
'promise1'
'script end'
'async1 end'
'promise2'
'setTimeout' 
```
[关于本题的解析传送门](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/7)


## js的异步解决方案历程及优缺点

### 一阶段 : 回调函数
```js
setTimeout(() => {
    // callback 函数体
}, 1000)
```
缺点：
1. 回调地狱，嵌套问题，难维护
2. 无法使用  try catch 捕获错误，不能 return

优点：

所有任务都是同步执行，不会影响程序的进程

### 二阶段 ：Promise

```js
ajax('XXX1')
  .then(res => {
      // 操作逻辑
      return ajax('XXX2')
  }).then(res => {
      // 操作逻辑
      return ajax('XXX3')
  }).then(res => {
      // 操作逻辑
  })
```

优点:

1. 解决了第一点中的嵌套问题 
2. 同时具备了第一点的优点

缺点: 

1. 链式调用依然不够优雅
2. promise无法取消，错误需要在回调函数中捕获

### 第三阶段 Generator
特点：**可以控制函数的执行**，可以配合 co 函数库使用
```js
function *fetch() {
    yield ajax('XXX1', () => {})
    yield ajax('XXX2', () => {})
    yield ajax('XXX3', () => {})
}
let it = fetch()
let result1 = it.next()
let result2 = it.next()
let result3 = it.next()
```
### 第四阶段 Async/await

优点 : 代码结构清晰，解决了promise中需要链式调用的问题

缺点：await 将异步代码改造成同步代码，如果多个异步操作没有依赖性而使用 await 会导致性能上的降低。

```js
async function test() {
  // 以下代码没有依赖性的话，完全可以使用 Promise.all 的方式
  // 如果有依赖性的话，其实就是解决回调地狱的例子了
  await fetch('XXX1')
  await fetch('XXX2')
  await fetch('XXX3')
}
```

## Promise 构造函数是同步执行还是异步执行，那么 then 方法呢？

构造同步 `.then` 异步,这题和上面的执行顺序那题很像，如果可以弄点那题这题不在话下


## 观察者模式和订阅-发布模式的区别，各自适用于什么场景

**观察者模式** 在软件设计中是一个对象，维护一个依赖列表，当任何状态发生改变自动通知它们。和发布订阅模式最大的区别是:

观察者模式 是**一对多**关系，观察者和维护的列表直接产生联系

而发布订阅模式是**多对多**关系，通过中间一个对象来统一进行交互，发布者和订阅者本身不产生联系

[参考文档【观察者模式 vs 发布-订阅模式】 ](https://juejin.cn/post/6844903513009422343)


## 聊聊 Redux 和 Vuex 的设计思想
对于这个问题可以看看这篇文章

[Vuex、Flux、Redux、Redux-saga、Dva、MobX【知乎】](https://zhuanlan.zhihu.com/p/53599723)


## 脑力题 ，如何让下面的代码执行

```js
var a = '??'

if(a == 1 && a == 2 && a == 3){
 	console.log('you win');
}

```
### 第一种解法

我们知道javascript中如果是`==`号，两遍的数据类型就会进行隐式转换,所以我们只需要重写a的`toString()`方法就可以达到效果


```js
var a = {
  _default:1,
  toString(){
    return this._default++
  }
}
if(a == 1 && a == 2 && a == 3){
  console.log('you win');
}
```

### 第二种解法

我们上一种解法很简单，但是只能对`==`号有效，如果是`===`号呢？

这个时候我们要换一个思路，访问`a`实际上也是访问`window.a`,只要对window这个对象进行数据劫持就可以达到需求

```js
var _default = 0
Object.defineProperty(window,'a',{
  get(){
    return ++ _default
  },
})

if(a === 1 && a === 2 && a === 3){
  console.log('you win');
}
```


## `Object.assign`属于深拷贝还是浅拷贝

Object.assign是对象合并的一个功能，属于浅拷贝

## `Array.forEach`是否会改变原数组

1. 当item 为基础数据类型时，不会改变原数组
2. 当item 为引用数据类型时，当你改数据类型中的某个子项时，会改变原数组



## 基础数据类型和引用数据类型的区别是什么？

### 一. 储存上的区别

1. 基本数据类型是存放到栈中的简单数据段
2. 引用数据类型，是存放在堆内存的对象，在栈内存中存放的是堆内存中具体的引用地址，通过这个地址可以快速的找到对象


### 二. 比较的却别


基本数据类型的比较是值的比较比如

```js
const a = `{}`
const b = `{}`
a === b  // true
```
引用类型的比较是引用地址的比较

```js
const a = {}
const b = {}
a === b  // false
```
上面代码a和b虽然看起来一样，但是由于他们的引用地址不一样，所以不相同。

### 三. 赋值的区别

简单数据类型，赋值不存在有深浅拷贝的问题

引用数据类型存在深浅拷贝的问题







