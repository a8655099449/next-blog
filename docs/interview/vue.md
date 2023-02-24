---
title: vue相关的面试题
description: 文章描述
aside: false
date: 2023-02-07
tags:
  - javascript
  - vue
  - 面试
---

# vue相关的面试题


## 谈谈你对MVVM的理解

:::tip
MVVM `Model-View-ViewModel`的简写，简单来说就是可以使数据驱动视图，简化了操作。
:::

## 对vue生命周期的理解


|  周期名 | 理解  |
| ------------ | ------------ |
| `beforeCreate` (创建前) | $el和数据对象 data都是undefined, 还未初始化  |
| `created`  (创建已经完成) | data数据已经初始化，`$el`还未初始化  |
| `beforeMount`   (载入前) | `$el` render函数首次被调用，但还没用挂在到html内，dom未生成 |
| `mounted`    (载入后) | dom已经渲染完成|
| `beforeUpdate `    (更新前) | 数据更显前调用，可以对数据进行一些拦截处理，不会触发重复的渲染状态 |
| `update `    (更新后) | 数据更新后触发的钩子 |
| `beforeDestroy  `    (准备销毁) | 在实例销毁之前调用。实例仍然完全可用。 |
| `destroyed  `    (销毁后) | 所有的事件监听器会被移除，所有的子实例也会被销毁。该钩子在服务器端渲染期间不被调用。 |

## Vue的双向数据绑定原理是什么

:::tip
采用数据劫持，结合发布\订阅者模式，通过Object.defineProperty() 来劫持各个属性的setter，getter，在数据变动时，发布消息给订阅者，触发相应的监听回调
:::

:::details 一个双向数据绑定的案例

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
  </head>
  <body>
    <div id="myapp">
      <input v-model="message" /><br />
      <span v-bind="message"></span>
      <span v-bind="message"></span>
      <span v-bind="message"></span>
    </div>
    <script type="text/javascript">
      var model = {
        message: "",
      };
      var models = myapp.querySelectorAll("[v-model=message]");
      for (var i = 0; i < models.length; i++) {
        models[i].onkeyup = function () {
          model[this.getAttribute("v-model")] = this.value;
        };
      }
      // 观察者模式 / 钩子函数
      // defineProperty 来定义一个对象的某个属性
      Object.defineProperty(model, "message", {
        set: function (newValue) {
          var binds = myapp.querySelectorAll("[v-bind=message]");
          for (var i = 0; i < binds.length; i++) {
            binds[i].innerHTML = newValue;
          }
          var models = myapp.querySelectorAll("[v-model=message]");
          for (var i = 0; i < models.length; i++) {
            models[i].value = newValue;
          }
          this.value = newValue;
        },
        get: function () {
          return this.value;
        },
      });
    </script>
  </body>
</html>
```

:::


## Proxy 相比于 defineProperty 的优势

:::tip
`Object.defineProperty()` 存在的问题
1. 不能监听数组的变化
2. 必须要遍历对象的每个属性
3. 必须要遍历嵌套的对象


Proxy 在 ES2015 规范中被正式加入，它有以下几个特点：

1. 针对整个对象而不是而不是对象的某个属性
2. 支持数组，Proxy不需要对数组的方法进行重载，节省了代码
3. Proxy 的第二个参数可以有 13 种拦截方法，这比起 Object.defineProperty() 要更加丰富
4. Proxy 的性能更高，而`Object.defineProperty()`是一个老方法
:::


## vue-router 有哪几种导航守卫?

:::tip
1. 全局守卫
2. 路由独享守卫
3. 组件内的守卫
:::

### 1.全局守卫
vue-router全局有三个守卫

|  守卫名 | 说明  |
| ------------ | ------------ |
|  router.beforeEach  |  进入路由之前 |
|  router.beforeResolve   |  开始解析路由 |
|  router.afterEach   |  进入路由之后 |

```js
 // main.js 入口文件
import router from './router'; // 引入路由
router.beforeEach((to, from, next) => { 
  next();
});
router.beforeResolve((to, from, next) => {
  next();
});
router.afterEach((to, from) => {
  console.log('afterEach 全局后置钩子');
});

```

### 2.路由独享守卫

在路由配置里可以单独配置守卫


```js
const router = new VueRouter({
  routes: [
    {
      path: '/foo',
      component: Foo,
      beforeEnter: (to, from, next) => { 
        // 参数用法什么的都一样,调用顺序在全局前置守卫后面，所以不会被全局守卫覆盖
        // ...
      }
    }
  ]
})
```

### 3. 组件内的路由守卫 ， 使用方法类似于生命周期
|  守卫名 | 说明  |
| ------------ | ------------ |
|  `beforeRouteEnter `  |  进入路由之前 ,**在路由独享守卫后调用 不能 获取组件实例 this，组件实例还没被创建**|
|  `beforeRouteUpdate`    |   路由复用同一个组件时, 在当前路由改变，但是该组件被复用时调用 可以访问组件实例 `this` |
| `beforeRouteLeave`   |离开当前路由时, 导航离开该组件的对应路由时调用，可以访问组件实例 this |



## Vue的路由实现：hash模式 和 history模式

### hash模式 
格式`https://xxx.xxx.com/#/my/`

改变哈希值并不会使浏览器浏览器刷新，可以通过监听哈希值变化，来实现前端路由。
### history模式

格式 `www.xxx.com/items/id`

格式上几乎和后端渲染一致，利用了HTML5的`pushState（），replaceState（）` 相比之下，比`hash`模式更加的优雅

但是`history`模式需要在后端进行配置，否则服务器会出现404的情况


## 组件之间的传值通信

### 父组件向子组件传值
1. 在子组件先定义`props`
```vue
<template>
  <div>{{msg}}</div>
</template>
<script>
export default {
  props: {
    msg: {
        type: String,
        required: true
    }
  }
}
</script>
```

2. 父组件将值传递给子组件

```vue
<template>
    <child :msg="message"></child>
</template>

<script>
import child from './child.vue';
export default {
  components: {
      child
  },
  data () {
    return {
        message: 'father message';
    }
  }
}
</script>
```
### 子组件将值传递给父组件

由于数据使单项流通的，所以我们禁止在子组件中修改`props`的属性，如果要修改，需要通知父组件，待父组件修改后再流向子组件

子组件可以通过`$emit()`方法来通知父组件


:::details 具体的代码

子组件代码

```vue
<template>
    <button @click="handleClick">点我</button>
</template>

<script>
export default {
  props: {
    msg: {
        type: String,
        required: true
    }
  },
  methods () {
    handleClick () {
      //........
      this.$emit('msgFunc');
    }
  }
}
</script>

```


父组件代码

```vue

<template>
    <child @msgFunc="func"></child>
</template>
<script>
import child from './child.vue';
export default {
    components: {
        child
    },
    methods: {
        func (msg) {
            console.log(msg);
        }
    }
}
</script>

```
:::


### 非父子\兄弟组件之间的通信

**第1种方法:**

在vue的原型链上new一个新的实例专门用来通讯，因为vue实例上有内置的`订阅者模式`，所以我们可以通过这个方法来通讯

或者自己手写一个订阅模式也可以



**第2种方法:**

通过vuex来进行数据管理


## Vue与Angular以及React的区别？
vue相对简单。学习成本比较低,自定义了许多的指令和语法糖，内部也帮我们做了很多事

react属于纯js，做的事情相对较少，只是帮我们实现了jsx模板编译和state状态管理，还有几个钩子函数，所以我们自己需要做的事情就比较多了

相比之下，react的可塑性可能更强一些，vue未来可期


## vuex是什么？ 怎么使用？ 什么场景使用？

1. vuex是一个全局状态管理仓库，也实现了双向数据绑定
2. 使用方法看文档
3. 中大型项目使用

## 列表循环中，为什么要传入`key`？
[其实在vue官方文档中就有提到了整个问题](https://cn.vuejs.org/v2/api/#key)

如果面试遇到，简单的来说，为列表中提供key可以使列表重排的信念变高，并且还能完整触发组件的生命周期钩子和过渡效果

复杂的就要涉及到vue中`diff`算法，整个相对复杂这里不表。


<br><br><br><br>

**参考文章**

[（掘金）公司要求会使用框架vue，面试题会被问及哪些？](https://juejin.cn/post/6844903858804621325)