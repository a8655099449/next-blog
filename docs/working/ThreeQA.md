---
title: three.js QA
description: 文章描述
aside: false
date: 2023-02-08
tags:
  - javascript
---


# three.js QA

## 如何设置场景背景颜色

```js
// 颜色 ， 透明度
render.setClearColor('#fff', 1);
```

## 如何添加控制器，并使用ts

[控制器文档](https://threejs.org/docs/index.html?q=OrbitControls#examples/zh/controls/OrbitControls)
```js
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// 添加控制器
const controls = new OrbitControls(camera, render.domElement);
```
threejs 里面的控制器导入没有类型注释，如果要使用有类型注释版需要下载`three-orbitcontrols-ts`
```
npn i three-orbitcontrols-ts
```

**使用ts版控制器**

有一个`three-orbitcontrols-ts`的库，但很遗憾它和官方版本的并不同步，会导致有些bug，但我们可以借用它的类型定义文件


## 添加坐标轴辅助
```js
const axes = new Three.AxesHelper(5);
scene.add(axes);
```


## 如何清除threejs的实例
以我的react版本为例子
```js
/** @name 清除实例 */
const clear = () => {
  ref.current.render.forceContextLoss();
  ref.current.render.dispose();
  ref.current.scene.clear();
  dom.current.removeChild(ref.current.render.domElement);
  ref.current.render = null;
};
```

## 使用gsap动画库

[gsap官方文档](https://greensock.com/docs/)

安装
```
pnpm i gsap
```

```javascript
gsap.to(cube.position, {
  x: 5,
  duration: 5,
});
```


## 如何添加gui控制器

gui是一个我们方便调试Three js效果的控制器

[codePen demo](https://codepen.io/programking/pen/MyOQpO)

```js
/** @name 添加gui调试器 */
const addGui = () => {
  const { cube, texture } = ref.current;
  const gui = new dat.GUI();
  // 添加一个gui的文件夹
  const cubeGui = gui.addFolder('cube');

  cubeGui.add(cube.position, 'x').min(0).max(5).name('x位置').step(0.01);
  cubeGui.add(cube.rotation, 'x').min(0).max(5).name('角度');
  cubeGui.add(cube.material, 'wireframe').name('展示线框');
  cubeGui
    .addColor(ref.current, 'color')
    .name('展示线框')
    .onChange((e) => {
      (cube.material as any).color.set(e);
    });
  ref.current.gui = gui;
};
```
**摧毁gui实例**
```js
ref.current.gui.destroy();
```


## 如何添加纹理

纹理的概念类似于贴图，就是给我们的三位物体添加贴图
```js{28}
/** @name 导入纹理 */
const loadTexture = () => {
  const textureLoader = new Three.TextureLoader();

  const doorTexture = textureLoader.load(diamondImg);
  // 设置纹理的偏移量
  // doorTexture.offset.x = 0.5;
  // 设置纹理的旋转

  // doorTexture.rotation = Math.PI / 4;
  // 设置中心点
  doorTexture.center.set(0.5, 0.5);
  // 设置重复
  doorTexture.wrapS = Three.MirroredRepeatWrapping;
  doorTexture.wrapT = Three.RepeatWrapping;
  doorTexture.repeat.set(2, 2);
  // 根据双插槽算法可以使很小的图片显示的更加清晰
  doorTexture.magFilter = Three.NearestFilter;
  doorTexture.minFilter = Three.NearestFilter;

  ref.current.texture = doorTexture;
  return doorTexture;
};
const doorTexture = loadTexture();
const cubeMaterial = new Three.MeshBasicMaterial({
  transparent: true,
  opacity: 1,
  map: doorTexture,
});
```


## 环境遮挡贴图
在[Material](https://threejs.org/docs/index.html#api/zh/materials/MeshBasicMaterial.aoMap)有个`aoMap`的属性，用于环境遮挡贴图，需要设置第二组UV


```javascript
// 1. 先导入贴图 
const aoTexture = textureLoader.load(ambientOcclusion);
// 2. 在材质里面增加aoMap的属性
const cubeMaterial = new Three.MeshBasicMaterial({
  transparent: true,
  map: doorTexture,
  alphaMap: alphaTexture, // 环境遮挡
  side: Three.DoubleSide, // 是否两面渲染贴图
  aoMap: aoTexture,
});
```


## 如何添加环境贴图
1. 由6张图片组成环境贴图

我们可以把一个场景想象成一个立方体，然后给立方体的每一面贴上一张图，我们置身于这个盒子之中

![](https://s2.loli.net/2023/02/09/l32ig49aKh8mNkG.png)
```javascript
const cubeTextureLoader = new THREE.CubeTextureLoader();
const envTexture = cubeTextureLoader.load(['img1','img2','img3','img4','img5','img6']);
scene.background = envTexture;
```
![](https://s2.loli.net/2023/02/09/Uzbx6KNi9hELaBj.gif)

2. 使用一张图当环境贴图 ，类似于下面这张图

![](https://s2.loli.net/2023/02/09/9Qzs5BtESFfpZhO.jpg)

```js
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

const rgbLoader = new RGBELoader();
rgbLoader.loadAsync('hdrImgSrc').then((e) => {
  e.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = e;
  scene.environment = e;
});
```

## 如何开启阴影

![](https://s2.loli.net/2023/02/09/KX4BJzRoAbUnkC6.png)


```js
const { scene, renderer, directionalLight } = ref.current;
// 添加一个球
const sphereGeometry = new three.SphereGeometry(1, 20, 20);
const material = new three.MeshStandardMaterial({
  metalness: 0.5,
  roughness: 0,
});
const sphere = new three.Mesh(sphereGeometry, material);
scene.add(sphere);
// 添加一个地面
const planeGeometry = new three.PlaneGeometry(10, 10);
const plane = new three.Mesh(planeGeometry, material);
plane.position.set(0, -3, 0);
// 将其设置到球的下方用于展示阴影
plane.rotation.x = -Math.PI / 2;
scene.add(plane);

// todo 开启阴影
renderer.shadowMap.enabled = true; // 渲染器阴影效果打开
directionalLight.castShadow = true; // 直射光打开阴影效果
sphere.castShadow = true; // 球可以产生阴影
plane.receiveShadow = true; // 地面可以接受阴影
```