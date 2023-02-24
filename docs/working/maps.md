---
title: 在开发中使用地图api的经验
description: 文章描述
aside: false
date: 2023-02-07
tags:
  - javascript
---

# 在开发中使用地图api的经验

## 谷歌地图

:::tip
谷歌地图在国内因为限制的原因用的并不广泛，而且面临着以下几点问题：
1. 需要有vpn才能访问外网地址
2. 文档无中文支持
3. 谷歌地图的开发者后台无法使用大陆手机号注册来获得`api_key`
:::
其中最难解决的是第三点，因为很难通过简单的方法来获得开发者验证。

以下就默认已经解决了以上的困难
### 如何去初始化谷歌地图

```js
const googleKey = `your key`
const jsSrc = `https://maps.google.com.hk/maps/api/js?key=${googleKey}&language=zh-CN&libraries=places`

const script = document.createElement('script')
script.src = jsSrc

document.body.appendChild(script)
script.addEventListener('load', () => {
  const map = new window.google.maps.Map(wrapDom, {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 8,
  })
})
```
[官方文档地址](https://developers.google.com/maps/documentation/javascript/examples/map-simple)
### 如何在项目中引入google map的类型提示

据我的使用体验，引入谷歌地图的ts类型提示和没有引入的开发体验天差地别

```sh
npm i -D @types/google.maps
```

### 如何去画一个点

[draw marker](https://developers.google.com/maps/documentation/javascript/examples/marker-simple)

谷歌地图的点支持自定义图片，只需要传入坐标就能在对应的位置画上点。

### 如果使用谷歌地图的规划路线

[路线服务 ](https://developers.google.com/maps/documentation/javascript/examples/directions-simple)

路线规划可以使用两个坐标来规划，值得一提的是我在开发中遇到的者两个问题

1. 屏蔽默认的marker 使用自己的起点和重点
2. 更改线的颜色

```javascript
const directionsRenderer = new google.maps.DirectionsRenderer({
  suppressMarkers: true, // 不显示默认的点
  polylineOptions: {
    strokeColor: "#ff8700"  // 更换线的颜色
  }
})
```

### 如何使用谷歌地图的搜索地点的服务
[place-search](https://developers.google.com/maps/documentation/javascript/examples/place-search)

[places-autocomplete](https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete)
