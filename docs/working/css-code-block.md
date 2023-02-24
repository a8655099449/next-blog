---
title: 日常开发常使用的css片段
description: 日常开发常使用的css片段
aside: false
date: 2021-02-07
tags:
  - css
---


# 日常开发常使用的css片段

## 渐变色
```css
background: -webkit-linear-gradient(top, #299beb 0%, #1eaae4 100%);
```
## 使用定位实现居中
```css
  position      : fixed;
  left          : 50%;
  top           : 50%;
  transform     : translate(-50%, -50%);
```

## 文字一行超出显示`...`，宽度必须固定 
```css
overflow: hidden;
white-space: nowrap;
text-overflow: ellipsis;
```
## 多行文字超出不显示，宽度必须固定

```css
display: -webkit-box;
-webkit-box-orient: vertical;
-webkit-line-clamp: 2; /*这个决定行数*/
overflow: hidden;
```

## 父容器的宽度由子元素决定，宽度超出不换行

```css
.parent{
  white-space: nowrap;
  display: inline-block;
}
.child {
  display: inline-block;
}
```


## 图片模糊效果

```css
filter   : blur(2px);
```

## 常用的box-shadow属性
```css
/* 纸片特效 */
box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);

```


## 实现固定宽高比
1. `img`和`video`标签本身具有像素的特性，所以如果只设置宽/高，另一项就会根据图片的尺寸来自动的调节尺寸

2. 使用`aspect-ratio`

这种方案可以说是非常简单了，缺点在于浏览器的兼容性不好

```css
.app {
  width: 100px;
  /* aspect-ratio: 16/9; */
  aspect-ratio: 1; 
  background: #000;
}
```

3. 使用`padding-bottom`属性

以下的代码也能实现一个固定宽高比的元素，只是目前只有一个空盒子而已，如果要添加内容可能就需要借助`绝对定位`了,而且嵌套也较多

```html
<style>
.wrapper {
  width: 40vw;
}
.intrinsic-aspect-ratio-container {
  width: 100%;
  padding-bottom: 100%;
  background-color: lightsalmon;
}


</style>

<div class="wrapper">
  <div class="intrinsic-aspect-ratio-container"></div>
</div>
```




## flex 让内容居右显示
```css
display: flex;
justify-content: flex-end;
```

## 解决下拉hover有间隔时列表，马上消失问题
![alt](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ae80e6b5b0cb45e59c4d1f1136297d90~tplv-k3u1fbpfcp-watermark.image)

```css
/* 父元素 */
visibility: visible;

/* 子元素 */
visibility: hidden;
transition: visibility 0.3s;
```



## 通用集合 

### normal.css
> `normal.css` 是网上一个通用解决各种浏览器怪癖的库

:::details 查看代码
```css
/*! normalize.css v8.0.0 | MIT License | github.com/necolas/normalize.css */

/* Document
   ========================================================================== */

/**
 * 1. Correct the line height in all browsers.
 * 2. Prevent adjustments of font size after orientation changes in iOS.
 */

html {
  line-height: 1.15; /* 1 */
  -webkit-text-size-adjust: 100%; /* 2 */
}

/* Sections
   ========================================================================== */

/**
 * Remove the margin in all browsers.
 */

body {
  margin: 0;
}

/**
 * Correct the font size and margin on `h1` elements within `section` and
 * `article` contexts in Chrome, Firefox, and Safari.
 */

h1 {
  font-size: 2em;
  margin: 0.67em 0;
}

/* Grouping content
   ========================================================================== */

/**
 * 1. Add the correct box sizing in Firefox.
 * 2. Show the overflow in Edge and IE.
 */

hr {
  box-sizing: content-box; /* 1 */
  height: 0; /* 1 */
  overflow: visible; /* 2 */
}

/**
 * 1. Correct the inheritance and scaling of font size in all browsers.
 * 2. Correct the odd `em` font sizing in all browsers.
 */

pre {
  font-family: monospace, monospace; /* 1 */
  font-size: 1em; /* 2 */
}

/* Text-level semantics
   ========================================================================== */

/**
 * Remove the gray background on active links in IE 10.
 */

a {
  background-color: transparent;
}

/**
 * 1. Remove the bottom border in Chrome 57-
 * 2. Add the correct text decoration in Chrome, Edge, IE, Opera, and Safari.
 */

abbr[title] {
  border-bottom: none; /* 1 */
  text-decoration: underline; /* 2 */
  text-decoration: underline dotted; /* 2 */
}

/**
 * Add the correct font weight in Chrome, Edge, and Safari.
 */

b,
strong {
  font-weight: bolder;
}

/**
 * 1. Correct the inheritance and scaling of font size in all browsers.
 * 2. Correct the odd `em` font sizing in all browsers.
 */

code,
kbd,
samp {
  font-family: monospace, monospace; /* 1 */
  font-size: 1em; /* 2 */
}

/**
 * Add the correct font size in all browsers.
 */

small {
  font-size: 80%;
}

/**
 * Prevent `sub` and `sup` elements from affecting the line height in
 * all browsers.
 */

sub,
sup {
  font-size: 75%;
  line-height: 0;
  position: relative;
  vertical-align: baseline;
}

sub {
  bottom: -0.25em;
}

sup {
  top: -0.5em;
}

/* Embedded content
   ========================================================================== */

/**
 * Remove the border on images inside links in IE 10.
 */

img {
  border-style: none;
}

/* Forms
   ========================================================================== */

/**
 * 1. Change the font styles in all browsers.
 * 2. Remove the margin in Firefox and Safari.
 */

button,
input,
optgroup,
select,
textarea {
  font-family: inherit; /* 1 */
  font-size: 100%; /* 1 */
  line-height: 1.15; /* 1 */
  margin: 0; /* 2 */
}

/**
 * Show the overflow in IE.
 * 1. Show the overflow in Edge.
 */

button,
input {
  /* 1 */
  overflow: visible;
}

/**
 * Remove the inheritance of text transform in Edge, Firefox, and IE.
 * 1. Remove the inheritance of text transform in Firefox.
 */

button,
select {
  /* 1 */
  text-transform: none;
}

/**
 * Correct the inability to style clickable types in iOS and Safari.
 */

button,
[type='button'],
[type='reset'],
[type='submit'] {
  -webkit-appearance: button;
}

/**
 * Remove the inner border and padding in Firefox.
 */

button::-moz-focus-inner,
[type='button']::-moz-focus-inner,
[type='reset']::-moz-focus-inner,
[type='submit']::-moz-focus-inner {
  border-style: none;
  padding: 0;
}

/**
 * Restore the focus styles unset by the previous rule.
 */

button:-moz-focusring,
[type='button']:-moz-focusring,
[type='reset']:-moz-focusring,
[type='submit']:-moz-focusring {
  outline: 1px dotted ButtonText;
}

/**
 * Correct the padding in Firefox.
 */

fieldset {
  padding: 0.35em 0.75em 0.625em;
}

/**
 * 1. Correct the text wrapping in Edge and IE.
 * 2. Correct the color inheritance from `fieldset` elements in IE.
 * 3. Remove the padding so developers are not caught out when they zero out
 *    `fieldset` elements in all browsers.
 */

legend {
  box-sizing: border-box; /* 1 */
  color: inherit; /* 2 */
  display: table; /* 1 */
  max-width: 100%; /* 1 */
  padding: 0; /* 3 */
  white-space: normal; /* 1 */
}

/**
 * Add the correct vertical alignment in Chrome, Firefox, and Opera.
 */

progress {
  vertical-align: baseline;
}

/**
 * Remove the default vertical scrollbar in IE 10+.
 */

textarea {
  overflow: auto;
}

/**
 * 1. Add the correct box sizing in IE 10.
 * 2. Remove the padding in IE 10.
 */

[type='checkbox'],
[type='radio'] {
  box-sizing: border-box; /* 1 */
  padding: 0; /* 2 */
}

/**
 * Correct the cursor style of increment and decrement buttons in Chrome.
 */

[type='number']::-webkit-inner-spin-button,
[type='number']::-webkit-outer-spin-button {
  height: auto;
}

/**
 * 1. Correct the odd appearance in Chrome and Safari.
 * 2. Correct the outline style in Safari.
 */

[type='search'] {
  -webkit-appearance: textfield; /* 1 */
  outline-offset: -2px; /* 2 */
}

/**
 * Remove the inner padding in Chrome and Safari on macOS.
 */

[type='search']::-webkit-search-decoration {
  -webkit-appearance: none;
}

/**
 * 1. Correct the inability to style clickable types in iOS and Safari.
 * 2. Change font properties to `inherit` in Safari.
 */

::-webkit-file-upload-button {
  -webkit-appearance: button; /* 1 */
  font: inherit; /* 2 */
}

/* Interactive
   ========================================================================== */

/*
 * Add the correct display in Edge, IE 10+, and Firefox.
 */

details {
  display: block;
}

/*
 * Add the correct display in all browsers.
 */

summary {
  display: list-item;
}

/* Misc
   ========================================================================== */

/**
 * Add the correct display in IE 10+.
 */

template {
  display: none;
}

/**
 * Add the correct display in IE 10.
 */

[hidden] {
  display: none;
}


```
:::

### 页面中默认样式普通的共用类
> 这里面我会定义一些开发中常用的类

:::details 展开查看
```css
ul,
li {
  list-style: none;
}
.click {
  user-select: none;
  cursor: pointer;
}
.click:hover {
  opacity: 0.8;
}
input,
button {
  outline: none;
}

button {
  border: none;
}
/* 鼠标悬停出现下划线 */
.underline {
  cursor: pointer;
}
.underline:hover {
  text-decoration: underline;
}

/* 图片的宽度跟随父元素 */
.auto-img {
  width: 100%;
  height: 100%;
  display: block;
}

/* 文字超出显示 ... */
.text-row-1 {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.text-row-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2; /*这个决定行数*/
  overflow: hidden;
}
.text-row-3 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3; /*这个决定行数*/
  overflow: hidden;
}
.text-row-4 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4; /*这个决定行数*/
  overflow: hidden;
}
*,
p,
div {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
@media (max-width: 900px) {
  .click:hover {
    opacity: 1;
  }
  .click:active {
    opacity: 0.8;
  }
  .underline:hover{
    text-decoration: none;
  }
  .underline:active{
    text-decoration: underline;
  }
}
```

:::

### 通用按钮样式
> 按钮我全部采用了`flex`布局 默认有 `40`的高度和`80`高度 <br>
:::details 展开查看
```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  user-select: none;
  border-radius: 4px;
  width: 80px;
  height: 40px;
  line-height: 40px;
}
.btn:hover {
  opacity: 0.8;
}

/*  !主按钮1 */

.btn-main {
  border: 1px solid var(--main-color);
  background: var(--main-color);
  color: #fff;
}
.plain.btn-main {
  border: 1px solid var(--main-color);
  background: transparent;
  color: var(--main-color);
}
/* !主按钮2 */
.btn-main-2 {
  border: 1px solid var(--main-color-2);
  background: var(--main-color-2);
  color: #fff;
}
.plain.btn-main-2 {
  border: 1px solid var(--main-color-2);
  background: transparent;
  color: var(--main-color-2);
}
/* ! 红色按钮 */
.btn-red {
  background-color: var(--red-color);
  color: #ffffff;
}

.btn-red.plain {
  border: 1px solid var(--red-color);
  background: transparent;
  color: var(--red-color);
}

/* ! 绿色按钮 */

.btn-green {
  background-color: var(--green-color);
  color: #ffffff;
}
.btn-green.plain {
  border: 1px solid var(--green-color);
  background: transparent;
  color: var(--green-color);
}

/* ! 灰色按钮 */

.btn-gray {
  background-color: var(--gray-color);
  color: #ffffff;
}

.btn-gray.plain {
  border: 1px solid var(--gray-color);
  background: transparent;
  color: var(--gray-color);
}
.btn-gray.gradient {
  background: linear-gradient(180deg, #ffffff 0%, #d8d8d8 100%);
  color: #aaaaaa;
}

/* ! 橙色按钮 */

.btn-orange {
  background-color: var(--orange-color);
  color: #ffffff;
}
.btn-orange.plain {
  border: 1px solid var(--orange-color);
  background: transparent;
  color: var(--orange-color);
}

/* ! 黄色按钮 */

.btn-yellow.plain {
  color: var(--yellow-color);
  background: transparent;
  border: 1px solid var(--yellow-color);
}
.btn-yellow {
  color: #fff;
  background: var(--yellow-color);
}

```
:::

## 文字篇

### 控制文字换行

```css

.text{
  white-space: nowrap;   /* 不允许换行文字多长都会在一行显示 */
  white-space: pre-line;   /* 会保留换行符，但是不会保留空白符 ，而且会自动换行 */
  white-space: pre-wrap;   /* 会保留空白符和换行符，会自动换行 */
  white-space: pre;   /* 会保留空白符和换行符 不会自动换行，和一个pre标签类似 */
}
```
但英语单词过长不会自动换行时（比如下图这个情况），我们可以使用这个属性这个强制换行
![alt](//image.woai996.com/picGo/20210612201825.png)
```css
.text{
  word-break: break-all;
}
```
### 文字竖向显示

1. 第一种方法是设置文字容器宽度为一个字的宽，利用自动换行的特点就可以实现竖向显示
2. `writing-mode:vertical-lr;` 设置这个属性可以更加轻松的达到效果
3. 设置上面的属性时中文字体会正常显示，而英文字体会旋转90°，我们可以使用这个属性来使英文字体不旋转`text-orientation: upright;`，或者使用`text-orientation: sideways;`使中文也换行


## 设置滚动条的样式

### 隐藏滚动条

```css
.hide-scrollbar {
  -ms-overflow-style: none; /* IE 10+ */
  scrollbar-width: none; /* firefox */
}
.hide-scrollbar::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}
```


### 更换滚动条样式

**在chrome中的样式**
```css

/* 设置滚动条宽度 */
.warp::-webkit-scrollbar {
  width: 10px;
}

/* 设置中间的小快 */
.warp::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background-color: #333;
}

/* 设置滚动区背景 */
.warp::-webkit-scrollbar-track {
  border-radius: 5px;
  background-color: #666;
}
```

**在火狐或者ie浏览器中**


