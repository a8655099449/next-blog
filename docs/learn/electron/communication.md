---
title: electron通信
description: 文章描述
aside: false
date: 2023-02-07
tags:
  - javascript
---

# 与nodejs进行通信
默认情况下，客户端的代码，是没法直接使用nodejs的api的，那么如果我们要使用这方面的能力应该怎么做呢？


## 第一种方法 [进程间进行通信官方教程](https://www.electronjs.org/zh/docs/latest/tutorial/ipc)


大概的思路就是，使用`preload.js`，挂载一个公用的api比如这样

依赖的api`ipcRenderer.send` 和 `ipcMain.on`
 
```js
// preload.js
const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld("electronAPI", {
  setTitle: (title) => ipcRenderer.send("setTitle", title),
});
```

在`main.js`中进行接收，这是一个订阅者模式

```js{13-17}
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  ipcMain.handle("ping", () => "ping");
  ipcMain.on("setTitle", (event, title) => {
    const webContents = event.sender;
    const win = BrowserWindow.fromWebContents(webContents);
    win.setTitle(title);
  });
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

在`render.js`中调用`preload.js`中暴露出来的api，从而实现交互:
```js{7}
// render.js
const button = document.querySelector("button");
const input = document.querySelector("#input");

const ping = async () => {
  const  value = input.value
  electronAPI.setTitle(value)
};
button.addEventListener("click", ping);
```
## 第二种方法，就是[上面提到的方法【如何与nodejs进程同行通信】](./start#如何与nodejs进程同行通信)
这种方法依赖的api是 `ipcRenderer.invoke` 和 `ipcMain.handle`


## 第三种方案 主渲染器（Main to renderer）

主要依赖的是`ipcRenderer.on`，假如node层希望去通知客户端层，可以使用下面这种方法


1. 在`preload.js`暴露出一个钩子，可以让客户端监听到

```javascript
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  onUpdateCounter: (callback) => ipcRenderer.on('update-counter', callback)
});
```
:::warning
这里出于安全性的考虑，并没有将整个的`ipcRenderer.on`函数暴露了，而只是暴露出来一个key
:::

2. 在`render.js`中进行监听
```javascript
window.electronAPI.onUpdateCounter((_event, value) => {
  const oldValue = Number(counter.innerText)
  const newValue = oldValue + value
  counter.innerText = newValue

  // 在这里我们可以使用event的这个参数，直接再次和node层进行交互
  _event.sender.send('counter-value', newValue)
})
```
3. 在`main.js`中发送事件

这里模拟一个node希望和客户端交互的场景，我们创建出来两个菜单，并且发送事件，在`win.webContents.send('update-counter', value)` 发送的事件，会被客户端的回调函数中接收到，从而产生交互

```javascript{16,20,35-37}
const { app, BrowserWindow, ipcMain, dialog, Menu } = require("electron");
const path = require("path");
const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "./src/preload.js"),
    },
  });
  const menu = Menu.buildFromTemplate([
    {
      label: app.name,
      submenu: [
        {
          click: () => win.webContents.send('update-counter', 1),
          label: 'count+1',
        },
        {
          click: () => win.webContents.send('update-counter', -1),
          label: 'count-1',
        }
      ]
    }

  ])
  Menu.setApplicationMenu(menu)

  win.loadFile("./index.html");

  win.webContents.openDevTools()
};
app.whenReady().then((res) => {

  ipcMain.on('counter-value', (_event, value) => {
    console.log(value) // 在这里监听，获得客户端返回的参数
  })

  createWindow();

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
  });
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});


```



