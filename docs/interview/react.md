---
title: react面试题
description: 文章描述
aside: false
date: 2023-02-07
tags:
  - javascript
  - 面试
  - react
---


## react组件如何通信

1. 父子组件通过 属性 和 props 通讯
2. 通过 context 通讯
3. 通过第三方的状态库来进行通信

## react中的生命周期

### class组件

|         周期名          |                    解释                    |
| :---------------------: | :----------------------------------------: |
|      `constructor`      |   类的初始构建函数，初始化state和`props`   |
|  `componentWillMount`   |              准备开始搭载dom               |
|        `render`         |               渲染dom的函数                |
|   `componentDidMount`   |                dom搭载完毕                 |
| `shouldComponentUpdate` | stat状态发生变化，这这一步可以阻止状态变化 |
|  `componentDidUpdate`   |             state已经发送变化              |
| `componentWillUnmount`  |                组件准备卸载                |



### hooks组件

|             周期名              |               解释                |
| :-----------------------------: | :-------------------------------: |
|             `hooks`             |          hooks本身调用的          |
| `useEffect当第二个参数为总数组` | dom挂载完毕会调用第一次的回调函数 |
| `useEffect当第二个参数为总数组` |  返回一个函数将会在dom卸载时调用  |
| `useEffect当第二个参数为state或者props` |  当数组里面的依赖发生变更时调用  |

## 高阶组件是什么？

[react高阶函数官方文档介绍](https://zh-hans.reactjs.org/docs/higher-order-components.html#gatsby-focus-wrapper)

:::tip
简单来说，高阶函数是指，以组件为参数，返回一个新的组件，比如说react-router的`withRouter` 和 redux的`connect`
:::

```javascript
import React, { useState } from "react";

const withHight = (Component) => {
  return () => {

    const [hightCount,setHightCount] = useState();

    return <Component hightCount={hightCount} setHightCount={setHightCount} />;
  };
};

export default withHight;
```


## react-router中有哪几种组件

`BrowserRouter` 和 `HashRouter` 在外层的根组件

`Route` 每个页面组件的容器

`Switch` 可以是页面每次只渲染一个`Route`

`Link` 页面跳转组件，类似于a标签


