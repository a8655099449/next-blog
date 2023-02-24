---
title: next是什么？
description: 文章描述
aside: false
date: 2023-02-07
tags:
  - next
---

## next是什么？
next 是一个非常出众的react脚手架，拥有以下的优点

1. 拥有非常好的`ssr`渲染能力
2. 速度很快的热更新以及启动能力
3. 简洁的配置和api路由能力

如果我们需要使用react来完成一个需要有seo优化的网站，非常推荐尝试使用`next`


但是对比于`umijs` \ `vite` \ `create-react-app`拥有以下的缺点
1. 中文文档不够友好
2. 需要拥有一定的react + js基础
3. 需要有一定的学习成本

next默认就是开启了`ssr`的能力

## 创建一个next的项目
1. 创建一个目录`next1` 

然后输入以下的命令
```shell
cd next1
npm init -y
npm i next react react-dom
```
2. 在安装的期间我们新建文件 `src/page/index.jsx` , 填充内容

```jsx
import React from 'react'
const App = () =>{
  return(
    <div>
      <h1>hello word</h1>
    </div>
  )
}

export default App
```

3. 更改`package.json`的`script`字段


```json{6-10}
{
  "name": "next1",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "next": "^13.1.1",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}
```

4. 等待依赖安装完成后，输入 `npm run dev`

可以看到启动成功，一个普通next项目就搭建完成了

![](https://s2.loli.net/2023/01/06/ACNJolOwh5qtv8n.png)


## 更改为ts项目

next内置支持ts，如果我们需要，只要将`src/page/index.jsx` 重命名为 `src/page/index.tsx` , next会自动安装关于ts的依赖，非常的智能

鉴于我们的`pages`目录在`src`下，建议将`tsconfig.json`修改为下面这样

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "strict": false,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "baseUrl": "./src",
    "paths": {
      "@/*": ["./*"]
    },
  },
  "include": ["**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

## next的项目