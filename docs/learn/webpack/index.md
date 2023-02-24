---
title: webpack是什么？
description: 文章描述
aside: false
date: 2023-02-07
tags:
  - webpack
---

# webpack是什么？


webpack是一个现代的打包工具，学习它将会对我们的工作有很大的帮助。是现代前端工程化的摇篮。


## webpack的五个概念


### 1. entry 

入口表示webpack以那个文件作为七点开始打包


### 2. output

输出表示webpack打包后的资源输出到哪里去，以及如何命名

### 3. loader

loader让webpack能够处理那些非js文件  , 比如`scss` \ `less` 文件

### 4. plugins

插件可以执行更广的任务，从打包优化，到压缩，一直到重新定义环境便令等等。

### 5. mode


模式指示webpack使用相应模式的配置



|     模式      |               描述               |
| :-----------: | :------------------------------: |
| `development` | 开发者模式，可以用于在本地调试的 |
| `production`  |    生产模式，用于在线上的环境    |


## 尝试使用webpack

1. 首先安装webpack至全局 `npm i webpack webpack-cli -g`

2. 新建文件 `src/index.js`在js里面随便输入一些内容，把这当作你的入口文件
> 我的jQuery是下载的，为了更好的体现出问题

```js
// 入口文件
import jQuery from "jquery";
import './index.css'
console.log('👴jQuery', jQuery)
```

3. 初始化项目 `npm init -y`

4. 在`package.json` 的 `scripts` 中增加打包指令，分别进行开发环境和生产环境的打包以辨区分


```json
{
  "name": "learm-01",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "build:dev": "webpack ./src/index.js -o ./build/ --mode=development",
    "build:pro": "webpack ./src/index.js -o ./build/ --mode=production"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "jquery": "^3.6.0"
  }
}
```
5. 分别执行 `npm run build:dev `  和  `npm run build:pro`

查看打包结果，我们会发现生产环境打包出来的代码会远小于开发环境的，其次就是webpack会将你的代码转换为`es5`更好的适配浏览器



让我们来测试一下webpack的打包兼容性如何，比如在`src/index.js`中输入下面这段代码

```javascript
const a = {}
console.log('👴>>>>', a?.name)
```
这里面我们使用到了最新es的链式语法，很多低版本的浏览器都还没有支持，让我们来看看webpack会如何处理

执行 `npm run build:pro`


查看打包的内容

```js
console.log("👴2022-06-15 21:24:38 index.js line:6",{}?.name);
```

以上是我打包出来文件的模样，可以说几乎没有做任何处理，那么要怎么改变这种情况呢？


[使用Babel编译js](./01#babel)


## 在webpack中打包样式

如果你在你的`index.js`中，引入`css`文件，然后在执行打包命令。你会发现会出现错误，这是因为webpack默认并不支持css的文件。

那么如何支持css文件的引入呢？

```js
// src/index.js
import './index.css'
```
会提示一下的错误
```
Module parse failed: Unexpected token (1:0)
You may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders
> * {
|   margin: 0;
|   padding: 0;
 @ ./src/index.js 2:0-20

webpack 5.73.0 compiled with 1 error in 307 ms
error Command failed with exit code 1.
info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.
```


遇到这种情况，我们的[loader](#3-loader)就可以登场了。loader就是为了支持各种各样后缀文件引入



### webpack.config.js


这时候我们不能再使用那种很长且抽象的指令来配置我们的输出了。我们需要引入一个配置文件，这个非常重要。


1. 新建文件`./webpack.config.js`，输入以下的内容

```javascript

const { resolve } = require('path')

module.exports = {
  // 入口文件
  entry: "./src/index.js",
  // 打包后输出的文件
  output: {
    filename: 'build.js',
    path: resolve(__dirname, 'build')
  },
  // 配置我们的loader 
  module: {
    rules: [
      {
        test: /\.css$/,
        // use中的顺序是从下至上执行的
        use: [
          // 将css-loader 解析出来的字符串创建成style标签添加到head当中
          'style-loader',
          // 将css的内容解析成字符串
          'css-loader'
        ]
      }
    ]
  },
  mode: 'development',
  plugins: []

}
```
2. 安装依赖，由于我们在配置中增加了两个`loader`，所以对应的也要安装这两个loader

```
npm install css-loader style-loader -D
```

3. 执行 `webpack`  ,当你的根目录存在`webpack.config.js`时，就可以不需要再输入那些指令


当我们使用html引入js时，就可以看到样式被同样引入了。


### 处理less资源

less死css的一种预处理语言，浏览器本身不支持less，webpack当然默认也不支持解析，但是我们可以通过增加loader的方式来处理less的资源，让我们看看怎么做。

1. 新建一个less文件，然后写一写样式在其中 `src/less/index.less`

```less
.box {
  width: 100px;
  height: 100px;
  border: 1px solid #000;
  a {
    color: #f00;
  }
}
```

2. 引入less文件

```js
// src/index.js
import './index.css'

import './less/index.less'
```

3. 这时候我们执行打包指令就会发现被拒绝了，让我们新增一个loader解决这个错误


在[webpack的官方文档](https://webpack.docschina.org/loaders/less-loader/)中就有对这部分的介绍  

下载依赖

```sh
yarn add -D less-loader less
```

配置loader


```javascript {25-30}
const { resolve } = require('path')

module.exports = {
  // 入口文件
  entry: "./src/index.js",
  // 打包后输出的文件
  output: {
    filename: 'build.js',
    path: resolve(__dirname, 'build'),
    clear:true
  },
  // 配置我们的loader 
  module: {
    rules: [
      {
        test: /\.css$/,
        // use中的顺序是从下至上执行的
        use: [
          // 将css-loader 解析出来的字符串创建成style标签添加到head当中
          'style-loader',
          // 将css的内容解析成字符串
          'css-loader'
        ]
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          'less-loader',
        ]
      },
    
    ]
  },
  mode: 'development',
  plugins: []
}
```

## 处理图片资源

[官服相关的文档](https://webpack.docschina.org/guides/asset-management#loading-images)

处理图片在webpack中会有两种模式，一种是将图片的资源转换为base64，一种则是将图片路径保存了，一般来说小图片就会用前一种，大图片则使用后一种。

在webpack.config.js中

```js{16-22}

const { resolve } = require('path')

module.exports = {
  // 入口文件
  entry: "./src/index.js",
  // 打包后输出的文件
  output: {
    filename: 'build.js',
    path: resolve(__dirname, 'build')
  },
  // 配置我们的loader 
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024 // 小于10kb时使用base64
          }
        }
      },
    ]
  },
  mode: 'development',
  plugins: []
}
```

为了验证这一点在index.js中进行测试，分别准备一张小图和大图，

```js
// src/index.js

import img1 from './img/img1.png'
import img2 from './img/img2.png'

const insetImage = (Icon) => {
  const myIcon = new Image();
  myIcon.src = Icon;
  document.body.appendChild(myIcon)
}
[img1, img2].forEach(item => insetImage(item))
```

可以看到小图就会被转换成base64的格式


## 修改打包资源的路径

我们希望，打包出来的资源后，不是所有文件都处于同级中，而是比如图片在一个文件夹中，js在一个文件夹中

修改webpack的配置，将图片输出到图片的文件夹中

```js{40-42}
const { resolve } = require('path')

module.exports = {
  // 入口文件
  entry: "./src/index.js",
  // 打包后输出的文件
  output: {
    filename: 'build.js',
    path: resolve(__dirname, 'build/static/')
  },
  // 配置我们的loader 
  module: {
    rules: [
      {
        test: /\.css$/,
        // use中的顺序是从下至上执行的
        use: [
          // 将css-loader 解析出来的字符串创建成style标签添加到head当中
          'style-loader',
          // 将css的内容解析成字符串
          'css-loader'
        ]
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          'less-loader',
        ]
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024
          }
        },
        generator: {
          filename: 'static/images/[hash][ext][query]'
        }
      },
    ]
  },
  mode: 'development',
  plugins: []
}
```

## 在打包的时候清空历史数据

在webpack5之前我们需要使用一个插件才能处理，如今只需要修改配置中的`config.output.clean = true`即可


```javascript{8}
const { resolve } = require('path')

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: 'build.js',
    path: resolve(__dirname, 'build/static/'),
    clean:true
  },
  ...
}
```

## 处理字体图标

在项目中难免要使用到各种图标或者字体文件，webpack会怎么处理呢？

我们在iconfont中下载一份图标字体，然后将其引入。

再执行打包,像字体文件这种webpack不会去对其内容作为处理，只是搬移到打包文件而已，所以不需要过多的配置，我们只需要把这些文件放到对应的文件夹就好了


```javascript{19-23}


const { resolve } = require('path')
module.exports = {
  // 入口文件
  entry: "./src/index.js",
  // 打包后输出的文件
  output: {
    filename: 'build.js',
    path: resolve(__dirname, 'build/static/'),
    clean: true
  },
  // 配置我们的loader 
  module: {
    rules: [
   
       ..., // 省略 
      {
        test: /\.(ttf|woff2?)$/i,  // 
        type: 'asset/resource',
        generator: {
          filename: 'static/media/[hash][ext][query]'
        }
      },
    ]
  },
  mode: 'production',
  plugins: []
}
```

## 处理其他资源

在开发中还会有类似于`mp3` \ `mp4`等格式的文件需要依赖，这种文件在webpack中和字体文件一样，不要进行处理，只需要增加更多后缀的处理即可，比如这样


```js{5}
rules: [

    ..., // 省略 
  {
    test: /\.(ttf|woff2?|mp3|mp4)$/i,  // 
    type: 'asset/resource',
    generator: {
      filename: 'static/media/[hash][ext][query]'
    }
  },
]
```


## 处理html资源

我们所有打包出来的资源，都需要用一个html去承载，每次都要去引入，很麻烦而且容易出错，那么怎么样让webpack帮我们自动建好html呢？

在[webpack中就有一个插件](https://webpack.docschina.org/plugins/html-webpack-plugin/)可以实现我们得愿望

**安装**

```sh
yarn add -D html-webpack-plugin
```
**使用**
```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  //  ... ,  
  plugins: [new HtmlWebpackPlugin()],
};
```

如果我们有自己的html模板，也可以使用添加参数的形式来完成

**使用**
```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  //  ... ,  
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public/index.html')
    })
  ],
};
```

