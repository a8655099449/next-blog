---
title: 使用webpack搭建react脚手架
description: 文章描述
aside: false
date: 2023-02-07
tags:
  - webpack
---

# 使用webpack搭建react脚手架

利用我们前面所学的知识，我们将使用webpack搭建react的教授架


## 脚手架的开发环境搭建
### 1. 新建文件夹`webpack-react-cli`
### 2. 新建文件`config/webpack.dev.js`

在`文件中填写以下的内容`
:::details
```js
const path = require("path")
const EslintWebpackPlugin = require('eslint-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const getStyleLoader = (rest = []) => {
  return [
    'style-loader',
    'css-loader',
    {
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          plugins: ['postcss-preset-env']
        }
      }
    },
    ...rest
  ]
}

module.exports = {
  entry: path.resolve(__dirname, '../src/index.js'),

  output: {
    filename: undefined,
    path: path.resolve(__dirname, 'dist'),
    chunkFilename: 'static/js/[name].chunk.js',
    assetModuleFilename: 'media/[hash:10][ext][query]'
  },
  module: {
    rules: [
      // 处理css
      {
        test: /.css$/,
        use: getStyleLoader()
      },
      {
        test: /.less$/,
        use: getStyleLoader(['less-loader'])
      },
      // 处理图片
      {
        test: /\.(jp?eg|png|gif|svg|webp)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024 // 小于10kb的图片转换为base64
          }
        }
      },
      // 处理其他资源
      {
        test: /\.(woff2?|ttf)$/,
        type: 'asset/resource'
      },
      // 处理js
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
          cacheCompression: false,
          plugins: [require.resolve('react-refresh/babel')] // react hmr

        }
      }
    ]
  },
  plugins: [
    new EslintWebpackPlugin({
      context: path.resolve(__dirname, '../src'),
      cache: true,
      cacheLocation: path.resolve(__dirname, '../node_modules/.cache/eslint-cache')
    }),
    new ReactRefreshWebpackPlugin(), // react hmr插件
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html'),
      title: 'react-app'
    }),
  ],
  mode: 'development',
  devtool: 'cheap-module-source-map',
  optimization: {
    splitChunks: {
      chunks: 'all'
    },
    runtimeChunk: {
      name(entryPoint) {
        return `${entryPoint}-runtime.js`
      }
    }
  },
  devServer: {
    hot: true,
    port: 3001,
    open: true,
    host: 'localhost',
    historyApiFallback: true // 解决react-router 404的问题

  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'] // 解决jsx的引入问题
  }
}
```
:::
### 3. 增加babel和eslint的配置文件
`.eslintrc.js`
```js
module.exports = {

  extends: ["react-app", "react-app/jest"],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    "no-var": 2 // 不可以使用var来定义变量
  },
  env: {
    browser: true,
    es2021: true,
  },
};
```
`babel.config.js`

```js
module.exports = {
  presets: ['react-app'],
}
```
### 4. 增加`package.json` 

`package.json`
```json
{
  "name": "webpack-react-cli",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "dev": "cross-env NODE_ENV=development webpack server --config ./config/webpack.dev.js",
    "start": "npm run dev"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "@babel/core": "^7.18.6",
    "@pmmmwh/react-refresh-webpack-plugin": "^0.5.7",
    "babel-loader": "^8.2.5",
    "babel-preset-react-app": "^10.0.1",
    "cross-env": "^7.0.3",
    "css-loader": "^6.7.1",
    "eslint-config-react-app": "^7.0.1",
    "eslint-webpack-plugin": "^3.2.0",
    "html-webpack-plugin": "^5.5.0",
    "less-loader": "^11.0.0",
    "postcss-loader": "^7.0.0",
    "postcss-preset-env": "^7.7.2",
    "react-refresh": "^0.14.0",
    "style-loader": "^3.3.1",
    "webpack": "^5.73.0",
    "webpack-cli": "^4.10.0",
    "webpack-dev-server": "^4.9.3"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.3.0"
  }
}
```

### 5. 简单的写一些react的组件
`src/index.js`

```js
import React from 'react'
import ReactDom from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
const root = ReactDom.createRoot(document.getElementById('app'))
root.render(<BrowserRouter>
  <App />
</BrowserRouter>)
```
`src/app.jsx`
```jsx
import React, { useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import About from "./About";

import "./global.less";
import Home from "./Home";

const App = (props) => {
  const [value, setValue] = useState(0);

  return (
    <div>
      <button
        onClick={(e) => {
          setValue(value + 1);
        }}
        className="button"
      >
        click{value}-66688889999
      </button>
      <div>
        <Link to={`/home`}>home</Link>
        <br />
        <Link to={`/about`}>about</Link>
      </div>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  );
};

export default App;
```

`src/Home.jsx`
```jsx
import React from 'react'
const Home = (props) =>{
  return(
    <div>
      Home
    </div>
  )
}
export default Home
```

`src/About.jsx`
```jsx
import React from 'react'
const About = (props) =>{
  return(
    <div>
      About
    </div>
  )
}
export default About
```

### 启动开发环境

```sh
npm i
npm start
```

## 搭建react脚手架生产环境


