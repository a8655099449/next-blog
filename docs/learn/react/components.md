---
title: react中自定义的一些常用小组件
description: 文章描述
aside: false
date: 2023-02-07
tags:
  - react
---


# react中自定义的一些常用小组件

## 懒加载组件的组件

注意，此组件是将组件进行懒加载（单独出来一个文件），并非在页面中懒加载

此组件依赖了这个库[@loadable/component](https://github.com/gregberge/loadable-components)
:::details 展开查看代码
```tsx
import loadable from "@loadable/component";

function load(fn: any, options: any) {
  const Component = loadable(fn, options);
  Component.preload = fn?.requireAsync || fn;
  return Component;
}

function LoadingComponent(props: {
  error: boolean;
  timedOut: boolean;
  pastDelay: boolean;
}) {
  if (props.error) {
    console.error(props.error);
    return null;
  }
  return (
    <div>
      loading
      {/* <Spin /> */}
    </div>
  );
}

const lazyLoad = (loader:any) => {
  return load(loader, {
    fallback: LoadingComponent({
      pastDelay: true,
      error: false,
      timedOut: false,
    }),
  });
};

export default lazyLoad;
```
:::

**使用**

```tsx
const ColorPicker = lazyload(() => import("./ColorPicker"));
<ColorPicker />
```


## 数字滚动组件

可以让数字有动态效果，依赖这个库[countUp.js](https://github.com/inorganik/countUp.js)

:::details

```javascript
import { CountUp } from 'countup.js';
import type { FC, ReactElement } from 'react';
import { useEffect, useRef } from 'react';

interface IProps {
  count: number;
  decimalPlaces?: number; // 显示小数位数，默认为0，不显示小数，会以四舍五入为单位
  separator?: string; // 千位分隔符 默认为没有。比如传入','的表现 : 1000 => 1,000
  duration?: number; // 动画时间，秒为单位 默认为2s
}
const Counter: FC<IProps> = ({
  count = 0,
  decimalPlaces = 0,
  separator = '',
  duration = 2,
}): ReactElement => {
  const ref = useRef<HTMLDivElement>(null);
  const instance = useRef<CountUp>();

  useEffect(() => {
    const counter = new CountUp(ref.current as HTMLDivElement, count, {
      decimalPlaces,
      separator,
      duration,
    });
    // counter.start();
    instance.current = counter;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (instance.current) {
      instance.current.update(count);
    }
  }, [instance, count]);

  return <span ref={ref} />;
};

export default Counter;
```
:::

