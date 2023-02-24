---
title: next的路由
description: 文章描述
aside: false
date: 2023-02-07
tags:
  - next
---

# next的路由

[next路由简介](https://nextjs.org/docs/routing/introduction)


next的路由并不需要手动创建，而是根据你创建的目录会自动生成路由。关键的文件夹名是`pages` 或者`src/pages`

比如`src/pages/index.jsx`  匹配的路由是 `/`

`src/pages/about.jsx`  匹配的路由是 `/about`



## 路由之间的跳转

### 使用`Link`跳转


```jsx
<Link  href={`/home`}>
  前往home 页面
</Link>
```
或者使用一个对象

```jsx
<Link href={{
  pathname: '/home',
  query: { id: 666 },
}}>
  前往home 页面
</Link>
```
### 使用api跳转

```jsx
import { useRouter } from 'next/router'
import React from 'react'
const App = () => {

  const { push, replace, back } = useRouter()

  return (
    <div>
      <h1>hello word</h1>
      <button onClick={() => push(`/home`)}>跳转</button>
      <button onClick={() => replace(`/home`)}>删除当前的页面跳转</button>
      <button onClick={() => back()}>返回上一级</button>
    </div>
  )
}

export default App
```


## 动态路由

如果文件名是`[param].js`的格式，next会默认这是一个[动态路由](https://nextjs.org/docs/routing/dynamic-routes)。

新建文件`src/pages/home/[id].js`

填充内容：

```jsx
import { useRouter } from 'next/router'
import React from 'react'
const HomeChild = () => {
  const { id ,name} = useRouter().query

  return (
    <div>
      HomeChild {id}:name
    </div>
  )
}
export default HomeChild
```


访问路径:`/home/2`

![](https://s2.loli.net/2023/01/06/yUHf9wLjgvGdFhp.png)

假如我们的路径是这样`/home/2?name=tom`，`query`的对象中将同时存在`id`和`name` 

```jsx
import { useRouter } from 'next/router'
import React from 'react'
const HomeChild = () => {

  const { id ,name} = useRouter().query

  return (
    <div>
      HomeChild {id}:{name}
    </div>
  )
}

export default HomeChild
```

![](https://s2.loli.net/2023/01/06/7j3iazVbDvmGH6f.png)


## 路由嵌套
next似乎没有嵌套路由的概念，取而代之的是[layouts](https://nextjs.org/docs/basic-features/layouts)

也就是我们可以在页面上嵌套一个外壳。

1. 创建一个`layout`组件

`src\components\layouts\AppLayouts.tsx`

```tsx
import { FC, ReactElement } from 'react';
type AppLayoutsProps = any
const AppLayouts: FC<AppLayoutsProps> = ({ children }): ReactElement => {
  return <div>
    <div>header</div>
    <main>{children}</main>
    <div>footer</div>
  </div>;
};
export default AppLayouts;
```



2. 在`src/pages/_app.tsx`中，加入以下的内容

```tsx
import AppLayouts from '@/components/layouts/AppLayouts'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: React.ReactElement) => React.ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout
  if (getLayout) {
    return getLayout(<Component {...pageProps} />)
  }
  return <AppLayouts>
    <Component {...pageProps} />
  </AppLayouts>
}
```


:::tip
在这里，我们可以看到，所有的页面都嵌套上了我们的layout组件，而且个页面提供了自定义外壳的能力。以免有些特殊的页面不需要外壳
:::

## 页面中定义自己的layout

假如有需求，我们需要在`/home`这个页面设置一个独立的layout，那么我们可以将代码这样写。


`src/pages/home/index.tsx`
```tsx
import React from 'react'
import { NextPageWithLayout } from '../_app'
const home: NextPageWithLayout = () => {
  return (
    <div>
      <h1>home page</h1>
    </div>
  )
}

home.getLayout = (page) => {

  return <div>
    <h1>home layout</h1>
    {page}
  </div>
}

export default home
```

![](https://s2.loli.net/2023/01/10/qC6laQsBbNtd34W.png)