---
title: 小程序地图的使用
description: 文章描述
aside: false
date: 2023-02-07
tags:
  - javascript
  - 小程序
---


# 小程序地图的使用

最近开发了一个出行类的小程序，遇到了一些开发上面的问题，在此总结

## 使用的什么地图
小程序地图开发使用的自带的`<map />` 组件，默认就是`腾讯地图`，且无法修改。如果我们要使用其他地图，比如`高德地图`、`百度地图`，只能使用它们的api，然后和微信配合使用，这只是在微信小程序内，其他小程序使用的什么地图还没有去验证过。

或者你使用`webview`嵌入一个web，使用什么地图就任意了，这不在本文的讨论重点

建议阅读本文前，先看看微信[map组件文档](https://developers.weixin.qq.com/miniprogram/dev/component/map.html)，一些基础的问题本文并不会提到。

## 创建地图的实例

地图的实例，调用地图一些其他的api，更好的实现功能 ，使用`wx.createMapContext`创建
```js
Page({
  onLoad(){
    this.createMapContext()
  },
  // 初始化地图示例
  createMapContext() {
    this.mapInstance = wx.createMapContext('baseMap', this); // 在组件中使用必须要传入第二个参数 this
  },
})
```
```html
<map id='baseMap'></map>
```

## 1. 画点 markers
`markers`在地图中扮演相当重要的角色，比如像下图中这种车辆的图标，就都是用这个画的。

![](//image.woai996.com/202210121043606.png)

而达成这种效果，也很简单。有两种方法

1. 在data里面设置makers,然后绑定到map组件上
```js
Page({
  data:{
    markers:[]
  }
})
```
```html
<map :markers="markers"></map>
```
2. 使用示例的`addMarkers`创建

```js
Page({

  onLoad(){
    this.createMapContext()
  },
  // 初始化地图示例
  createMapContext() {
    this.mapInstance = wx.createMapContext('baseMap', this); // 在组件中使用必须要传入第二个参数 this
  },
  addMarkers(markers){
    this.mapInstance.addMarkers({
      markers:[...markers]
    })
  }
})
```
**清除地图的makers**

`this.setData({markers:[]})` or [`MapContext.removeMarkers`](https://developers.weixin.qq.com/miniprogram/dev/api/media/map/MapContext.removeMarkers.html)

## 2. 规划路线
![](https://s2.loli.net/2022/10/12/EQnPSHUoz4GCRv7.png)

规划路线我使用的是[百度的路线规划api](https://lbsyun.baidu.com/index.php?title=webapi/direction-api-v2)

下面是我封装的一个获取百度路线规划的api
```js
// 百度系坐标转换为微信系坐标
export const baiduLocationToWx = ({ lat, lng }) => {
	let pi = (3.14159265358979324 * 3000.0) / 180.0;
	let x = lng - 0.0065;
	let y = lat - 0.006;
	let z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * pi);
	let theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * pi);
	lng = z * Math.cos(theta);
	lat = z * Math.sin(theta);

	return {
		string: `${lat},${lng}`,
		object: {
			longitude: lng,
			latitude: lat,
		},
	};
};


// 将百度的Steps转换为微信的路径
const stepsToWxSteps = (steps = []) => {
	const list = [];
	steps.forEach(item => {
		const paths = item.path.split(';');
		paths.forEach((path = '') => {
			const [lng, lat] = path.split(',');
			list.push(baiduLocationToWx({ lat, lng }).object);
		});
	});

	return list;
};

/**
 * 使用百度api获得路线规划，传入百度坐标系
 * origin 起点坐标
 * destination 终点坐标
 */
export const getMapSteps = async ({
	origin = `28.238401,112.880487`,
	destination = `28.247468916076578,112.88817815576922`,
	ak = 'your key',
}) => {

  /* 
  getDriving = 你的百度api请求封装
  */
	const res = await getDriving({
			origin,
			destination,
			ak,
	});

	if (res.status === 0 && Array.isArray(res.result?.routes)) {
		let steps = res.result?.routes?.[0].steps;
		const { duration, distance } = res.result?.routes?.[0];
    /*
      百度的坐标，需要转换成微信的坐标，否则不能使用
    */
		steps = stepsToWxSteps(steps);
		return { steps, duration, distance };
	}
	Message.info(`路径规划失败`);
	return {};
};
```
**使用示例**

```js
Page({
  data:{
    polyline:[]
  },
  /* 规划路线，需要两个坐标 */
  planningRoute({
    origin = ``, // 起点
		destination = ``, // 终点
  }){

    // 注意坐标的转换， getMapSteps 需要传入百度系的坐标
    const { steps } = await getMapSteps({
      origin,
      destination,
    });
    this.polyline = [
      {
        points: steps,
        color: '#3272f5',
        width: 7,
        arrowLine: true,
      },
    ];

  }
})
```
```html
<map :polyline="polyline"></map>
```

## markers 上的气泡

气泡现在支持使用`cover-view`这个组件直接传入，只需要指定`maker-id`就行了

![](https://s2.loli.net/2022/10/12/H4JpRijZcOCqQ5m.png)

```html
<map
    id="baseMap"
    :polyline="polyline"
    :markers="markers"
  >
  <!-- 一定要包裹在map组件内 ，且需要使用 slot="callout" 插槽 -->
  <cover-view slot="callout">

    <!-- 指定 :marker-id 来确定显示在哪个marker上 -->
    <cover-view class="customCallout66" :marker-id="6">
      <cover-view> 我是个气泡 我是个气泡 </cover-view>
      <cover-view> 我是个气泡 我是个气泡 我是个气泡 </cover-view>
    </cover-view>
  </cover-view>
</map>
```

:::warning
`cover-view`气泡中的文字，不会自动换行，样式上可能开发者工具和真机上有所差别，且不支持css动画，不宜绘制复杂的样式
:::

## maker的转向问题

在开发中可能遇到，需要设置maker的角度问题，比如在行驶中的车辆，需要持续的更新车辆的位置，和车辆的角度。如果每次都在最新的位置上绘制`marker`会显得十分的生硬

![](https://s2.loli.net/2022/10/12/BWc9nYhsLEaz8CK.gif)


在小程序中提供了[MapContext.translateMarker](https://developers.weixin.qq.com/miniprogram/dev/api/media/map/MapContext.translateMarker.html)，来平滑的移动maker，

然后我们可以根据路线中相邻的两个点，来确定车辆的角度，使用下面这个函数，可以计算出角度

```js
/**
 * 根据两个坐标计算角度 传入包含{ latitude , longitude } 的对象
 * 传入微信系的坐标
 * @returns number
 */
export function getAngle({ startLocation, endLocation }) {
	let lat_a = startLocation.latitude;
	let lat_b = endLocation.latitude;
	let lng_a = startLocation.longitude;
	let lng_b = endLocation.longitude;

	var a = ((90 - lat_b) * Math.PI) / 180;
	var b = ((90 - lat_a) * Math.PI) / 180;
	var AOC_BOC = ((lng_b - lng_a) * Math.PI) / 180;
	var cosc = Math.cos(a) * Math.cos(b) + Math.sin(a) * Math.sin(b) * Math.cos(AOC_BOC);
	var sinc = Math.sqrt(1 - cosc * cosc);
	var sinA = (Math.sin(a) * Math.sin(AOC_BOC)) / sinc;
	var A = (Math.asin(sinA) * 180) / Math.PI;
	var res = 0;
	if (lng_b > lng_a && lat_b > lat_a) res = A;
	else if (lng_b > lng_a && lat_b < lat_a) res = 180 - A;
	else if (lng_b < lng_a && lat_b < lat_a) res = 180 - A;
	else if (lng_b < lng_a && lat_b > lat_a) res = 360 + A;
	else if (lng_b > lng_a && lat_b == lat_a) res = 90;
	else if (lng_b < lng_a && lat_b == lat_a) res = 270;
	else if (lng_b == lng_a && lat_b > lat_a) res = 0;
	else if (lng_b == lng_a && lat_b < lat_a) res = 180;
	return res;
}
```

下面是写的一个示例

```js
Page({
  // 规划路线
  async drawPolyLine({
    origin = ``, // 起点
    destination = ``, // 终点
    /**
     * showType类型
     * 1: 展示起点和终点图标
     * 2: 起点展示车的图标 终点不画图标
     * */
    showType = null, //
  }) {
    if (!destination) {
      destination = `${this.latitude},${this.longitude}`;
    }
    const [lat, lng] = origin.split(`,`);

    const { string: endLocationString } = wxLocationToBaidu({
      lat,
      lng,
    });
    const { string: startLocationString } = wxLocationToBaidu({
      lat: this.latitude,
      lng: this.longitude,
    });

    const { steps } = await getMapSteps({
      origin: startLocationString,
      destination: endLocationString,
    });
    this.polyline = [
      {
        points: steps,
        color: '#3272f5',
        width: 7,
        arrowLine: true,
      },
    ];
    const startLocation = steps[0];
    const endLocation = steps[steps.length - 1];

    if (showType === 1) {
      this.lastMoveLotion = startLocation;
      this.markers = [
        {
          ...startLocation,
          width: 15,
          height: 30,
          id: 999,
          iconPath: carIconPath,
          anchor: {
            x: 0.5,
            y: 0.5,
          },
          rotate: 0,
        },
      ];
      this.lastMoveLotion = startLocation;
      this.startMoveCar();
    }
  },
    // 开始移动车辆
  startMoveCar() {
    this.moveIndex = 0;
    clearTimeout(this.timer);
    // 每秒钟移动一部
    this.moveCarByIndex();
  },
  moveCarByIndex() {
    this.moveIndex++;
    const { polyline, moveIndex, lastMoveLotion } = this;
    const points = polyline[0].points;

    if (moveIndex >= points.length) {
      Message.info(`到达终点`);
      return;
    }
    const moveLocation = points[moveIndex];

    const rotate = getAngle({ startLocation: lastMoveLotion, endLocation: moveLocation });
    const _this = this;
    this.timer = setTimeout(() => {
      this.mapInstance.translateMarker({
        markerId: 999,
        destination: moveLocation,
        duration: 200,
        rotate: rotate + Math.random(),
        complete: () => {
          _this.moveCarByIndex();
        },
      });
      this.lastMoveLotion = moveLocation;
    }, 50);
  },
})
```

:::warning 遇到的问题
在开发的时候需要实时的查看真机效果
1. translateMarker设置`moveWithRotate: true`时，在开发者工具上角度不再生效，但是真机上没有问题
2. `autoRotate`也只有在真机上有效果，且计算的角度有点问题
:::

## 坐标的转换
百度和微信，使用的不是一种规范的坐标，使用时需要进行转换

```js

// 微信转百度
export const wxLocationToBaidu = ({ lat, lng }) => {
	let x_pi = (3.14159265358979324 * 3000.0) / 180.0;
	let x = lng;
	let y = lat;
	let z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
	let theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);
	let _lng = z * Math.cos(theta) + 0.0065;
	let _lat = z * Math.sin(theta) + 0.006;
	return {
		string: `${_lat},${_lng}`,
		object: {
			longitude: _lng,
			latitude: _lat,
		},
	};
};

// 百度转微信
export const baiduLocationToWx = ({ lat, lng }) => {
	let pi = (3.14159265358979324 * 3000.0) / 180.0;
	let x = lng - 0.0065;
	let y = lat - 0.006;
	let z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * pi);
	let theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * pi);
	lng = z * Math.cos(theta);
	lat = z * Math.sin(theta);

	return {
		string: `${lat},${lng}`,
		object: {
			longitude: lng,
			latitude: lat,
		},
	};
};

```

