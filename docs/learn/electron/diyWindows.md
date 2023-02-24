---
title: 如何在electron中，自定义自己的窗口
description: 文章描述
aside: false
date: 2023-02-07
tags:
  - head
---

# 如何在electron中，自定义自己的窗口

在 `electron` 中，我们启动一个窗口的时候，默认系统是有个窗口的，但这个窗口在很多时候并不符合我们的期望，那么怎么去定义自己的窗口呢？


## 如何隐藏菜单栏？
使用以下的api
```ts
win.setMenu(null);
```

## 如何隐藏系统的head?

```ts{2}
new BrowserWindow({
  titleBarStyle: 'hidden',
});
```

**自定义自己的head**

我们在顶部条设置`-webkit-app-region: drag;`这样自己的head就可以拖拽了，但这里面还是有个问题，就是hover效果会失效，我还在尝试解决
```css{7}
.head{
  width: 100%;
  height: 30px;
  line-height: 30px;
  background-color: rgb(198, 47, 47);
  /* 值为no-drag时不可拖拽 */
  -webkit-app-region: drag;
}
```

## 如何是你的窗口边框，拥有阴影和圆角效果？
这个我自己也在网上搜寻了众多答案，但如果你在比如的你的`body`元素上，设置`box-shader实际上没有效果`，我们需要做的是，先将窗口的背景设置为透明的
```js
new BrowserWindow({
   transparent: true
});
```

然后在`body`标签上加上内边距，设置一种盒中盒的效果，在里面的盒子，就是随意使用css设置阴影和圆角效果了
