---
title: 第一个electron 应用
description: 文章描述
aside: false
date: 2023-02-07
tags:
  - electron
---


# 第一个electron 应用

## 何为electron？

electron基于chrome和nodejs的桌面端构建框架，可以以较低让前端人员也永远写桌面端的能力，前端的工作人员想必对`chrome`和`nodejs`都不会陌生。

所以如果有兴趣，或者工作中有需求，选择使用electron是个不错的选择。



## 构建第一个 electron 程序


[第一个electron程序官方文档教程](https://www.electronjs.org/zh/docs/latest/tutorial/tutorial-first-app)

具体的步骤，在文档中已经很详细，所以这里省略初始步骤。

npm下载不了时，如何做，我自己就遇到遇到一个错误，安装时报错`read ECONNRESET`

可以[参考这篇文章](https://blog.csdn.net/weixin_45111820/article/details/121411838)

具体就是

```
npm config set ELECTRON_MIRROR http://npm.taobao.org/mirrors/electron/
```


## 如何与nodejs进程同行通信

electron之所以强大，在于可以借助`nodejs`调用一些与系统交互的文件，否则你的程序，可能更适合在浏览器中使用。因为不需要下载，更加方便。


[增加预加载模块](https://www.electronjs.org/zh/docs/latest/tutorial/tutorial-preload)

那么怎么去建造这些桥梁呢？

这些在上面的官方文档中都有详细的介绍，我这里再简单写一下

### 1. 增加`preload.js`
```js
const { contextBridge, ipcRenderer } = require("electron");

// 挂载versions这个对象在window上
contextBridge.exposeInMainWorld("versions", {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  ping: () => ipcRenderer.invoke("ping"), // 类似于一个接口一样的访问 ， 返回的是一个promise对象
});
```
### 2. 在`main.js`中修改

```js{13,9}
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"), // 预加载js
    },
  });

  ipcMain.handle("ping", () => "ping"); // 接受到访问后返回的内容

  win.loadFile("index.html");

};

app.whenReady().then((res) => {
  createWindow();

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
  });
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
```
### 3. 增加`render.js`

```js
const app = document.querySelector("#app");
app.innerHTML = `version:${versions.electron()}`;

const ping = async () => {
  const response = await window.versions.ping(); // 访问我们预留的一个函数
  alert(response);
};

const button = document.querySelector("button");
button.addEventListener("click", ping);
```


### 4. 导入`render.js`函数
在index.html中导入
```html {13}
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <h1>app</h1>
  <button >ping</button>
  <div id="app"></div>
  <script src="./render.js"></script>
</body>
</html>
```


## 打包electron程序

[打包官方文档教程](https://www.electronjs.org/zh/docs/latest/tutorial/tutorial-packaging)







