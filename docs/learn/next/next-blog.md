---
title: 使用next打造自己的博客
description: 文章描述
aside: false
date: 2023-02-20
tags:
  - next
  - react
---

# 使用next打造自己的博客

本文将介绍，如何使用next来打造自己的私人博客。

**参考文档**
- [使用 React 和 Next.js 构建博客](https://zhuanlan.zhihu.com/p/461577858)


## 创建next项目

使用`create-next-app`来创建项目

```sh
pnpm create next-app
```

得到一个大概这样的目录结构

![](https://s2.loli.net/2023/02/21/2zAN1WHFLb7j5is.png)


把首页的内容清一清，开始完成我们的博客系统


## 创建markdown文件夹

我们做开发，非常喜欢使用`markdown`来编写技术文档，创建文件夹`src/docs`。然后随便加入几篇markdown文章。

我这边也准备好了
![](https://s2.loli.net/2023/02/21/Nzdu6i7SeV5k8FU.png)


## 读取静态的markdown文件

这一步主要使用 nodejs 的文件模块来读取`src/docs`下的markdown文件，然后转换成html渲染到页面中


需要用到三个库`remark-html front-matter remark`
```
pnpm i remark-html front-matter remark
```

1. 创建文件`src/lib/dateformat.ts` 用来处理时间

```ts
const toMonth = new Intl.DateTimeFormat("en", { month: "long" });

// 格式化为 YYYY-MM-DD
export function ymd(date: Date) {
  return date instanceof Date
    ? `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(
        2,
        "0"
      )}-${String(date.getUTCDate()).padStart(2, "0")}`
    : "";
}

// 格式化为 DD MMMM, YYYY
export function friendly(date: Date) {
  return date instanceof Date
    ? `${date.getUTCDate()} ${toMonth.format(date)}, ${date.getUTCFullYear()}`
    : "";
}
```

2. 安装好依赖后，我们创建文件`src/lib/posts-md.ts`，在其中写入内容:


```ts
import { promises as fsp } from "fs";
import path from "path";
import fm from "front-matter";
import { remark } from "remark";
import remarkhtml from "remark-html";
import * as dateformat from "./dateformat";

const fileExt = "md";

// 获取文件夹相对路径
function absPath(dir: string) {
  return path.isAbsolute(dir) ? dir : path.resolve(process.cwd(), dir);
}

/**
 * 获取文件夹中 Markdown 文件名列表，以数组形式返回
 * @param {*} dir
 * @returns
 */
export async function getFileIds(dir: any = "./") {
  const loc = absPath(dir);
  const files = await fsp.readdir(loc);

  return files
    .filter((fn) => path.extname(fn) === `.${fileExt}`)
    .map((fn) => path.basename(fn, path.extname(fn)));
}

/**
 * 获取单个 Markdown 文件的内容
 * @param {*} dir
 * @param {*} id
 * @returns
 */
export async function getFileData(dir: any = "./", id: string) {
  const file = path.join(absPath(dir), `${id}.${fileExt}`),
    stat = await fsp.stat(file),
    data = await fsp.readFile(file, "utf8"),
    matter = fm(data) as any,
    html = (await remark().use(remarkhtml).process(matter.body)).toString();

  // 日期格式化
  const date = matter.attributes.date || stat.ctime;
  matter.attributes.date = date.toUTCString();
  matter.attributes.dateYMD = dateformat.ymd(date);
  matter.attributes.dateFriendly = dateformat.friendly(date);

  // 计数
  const roundTo = 10,
    readPerMin = 200,
    numFormat = new Intl.NumberFormat("en"),
    count = matter.body
      .replace(/\W/g, " ")
      .replace(/\s+/g, " ")
      .split(" ").length,
    words = Math.ceil(count / roundTo) * roundTo,
    mins = Math.ceil(count / readPerMin);

  matter.attributes.wordcount = `${numFormat.format(
    words
  )} words, ${numFormat.format(mins)}-minute read`;

  return {
    id,
    html,
    ...matter.attributes,
  };
}
```


3. 创建文章组件，创建文件`src/pages/[id].tsx`，填写内容
```ts
import { getFileData, getFileIds } from '@/lib/posts-md';
import { FC, ReactElement } from 'react';

type PostProps = {
  postData: any

}
const Post: FC<PostProps> = ({ postData }): ReactElement => {

  const html = `
  <h1>${postData.title}</h1>
  <p class="time">日期：<time datetime="${postData.dateFriendly}">${postData.dateYMD}</time></p>
  <p class="words">${postData.wordcount}</p>
  ${postData.html}
`;

  return <div dangerouslySetInnerHTML={{
    __html: html
  }}></div>;
};
const postsDir = "src/docs";
export async function getStaticPaths() {
  const paths = (await getFileIds(postsDir)).map((id) => {
    return { params: { id } };
  });
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: any) {
  return {
    props: {
      postData: await getFileData(postsDir, params.id),
    },
  };
}


export default Post;
```

:::tip
`[id].tsx`这种格式属于next中的动态路由，当在浏览器中输入的路由，就会动态的传入`id`这个字段中，这样我们就可以使用路径去获取markdown的内容，然后转换成html渲染到页面中。
:::


现在我们在浏览器中访问`http://localhost:3000/01`或者`http://localhost:3000/02`，可以发现已经转换完成了

这样我们博客中最重要的一步已经完成了,**那就是渲染内容**

![](https://s2.loli.net/2023/02/21/rwJbgBuLQGHexoc.png)

你可能注意到文章头部有这样一个内容,这是因为我在每个文章头部添加了配置，会使用`front-matter`读出来，这样方便我们的文章页面更好的定制。

![](https://s2.loli.net/2023/02/21/pscZSrYmWeQKbvJ.png)
```markdown{1-9}
---
title: 使用next打造自己的博客
description: 文章描述
aside: false
date: 2023-02-20
tags:
  - next
  - react
---

# 使用next打造自己的博客

本文将介绍，如何使用next来打造自己的私人博客。
....其他的内容
```


到这一步后，我们还有几个问题

1. 全局layout 
2. 代码快高亮
3. 文章列表渲染
4. 首页的设计
5. 文章页面样式设计



## 全局layout

正常的博客差不多是这样

![](https://s2.loli.net/2023/02/21/J9NHIu7LiC4D58P.png)

我们`content`部分已经完成了

1. 新建文件`src\components\Layout.tsx`

```tsx
import { FC, ReactElement, ReactNode } from 'react';

type LayoutProps = {
  children: ReactNode
}
const Layout: FC<LayoutProps> = ({ children }): ReactElement => {
  return <div>
    <header>header</header>
    {children}
    <footer>footer</footer>
  </div>;
};

export default Layout;
```
2. 修改`src\pages\_app.tsx`中的内容

```tsx
import Layout from '@/components/Layout'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return <Layout>
    <Component {...pageProps} />
  </Layout>
}
```

![](https://s2.loli.net/2023/02/22/vnaDt1dP6qYE2mK.png)

这样我们给所有的页面套上layout了，但是比较不好看，我们给它添加一点点样式

3. 修改layout样式

添加`src\components\index.module.less`

```less
.layout {

  .header {
    height: 40px;
    line-height: 40px;
    border: 1px solid #000;
    text-align: center;
  }

  .footer{
    height: 40px;
    line-height: 40px;
    text-align: center;
    border: 1px solid #000;
  }
  .content{
    min-height: 80vh;
  }
}
```



`Layout.tsx`

```tsx
import { FC, ReactElement, ReactNode } from 'react';
import styles from './index.module.less';
type LayoutProps = {
  children: ReactNode
}
const Layout: FC<LayoutProps> = ({ children }): ReactElement => {
  return <div className={`${styles['layout']}`}>
    <header className={`${styles['header']}`}>header </header>
    <div className={`${styles['content']}`}>
      {children}
    </div>
    <footer className={`${styles['footer']}`}>footer</footer>
  </div>;
};

export default Layout;
```


:::warning
如果现在next导入less文件需要添加额外的依赖

1. 下载[`next-with-less`](https://github.com/elado/next-with-less)插件

```
pnpm i next-with-less less less-loader
```

2. 在`next.config.js`中修改内容

```javascript{1,8}
const withLess =require('next-with-less')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = withLess(nextConfig)
```
:::

这样我们的layout就完成了，至于需要更好看特效，则需要自己完成

![](https://s2.loli.net/2023/02/22/yS76DpRXJZMreIz.png)



## 文章列表页面