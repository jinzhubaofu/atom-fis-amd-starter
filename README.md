# atom-fis3-starter

使用 atom 和 fis3 来创建网站应用的种子项目

## 上手指南

### 前置条件

1. NodeJS(>=6.0)
2. php(>=5.4)

### Setup

1. 下载 .zip 包
2. 解压 zip 包
3. cd atom-fis3-starter
4. npm install

### 构建

```
npm run build
```

### 启动本地开发服务器

```sh
npm start
open http://localhost:9000/src/Todo/index.php
```

### 修改后自动构建

```sh
npm run watch
```

## 开发指南

### 目录结构

```text
├── README.md
├── docs                           // 所有的文档应该放到这里
│   └── ide.md
├── fis-conf.js                    // fis3 构建的配置文件
├── package.json               
├── scripts                        // 所有的本地脚本在这个目录
│   ├── build.sh                   // 构建用的 shell
│   └── webserver                  // 本地开发用的服务器在这里
│       ├── AtomWrapper.class.php  // 渲染 atom php 文件用的脚本
│       ├── get-mock-data.js       // 用于生成 mock 数据
│       └── index.php              // 本地开发服务器的入口 php 文件
├── src                            // 所有的源码在这里
│   ├── Todo                       // 建议每个页面都用一个目录来承载
│   │   ├── index.php              // 入口模板[关键]
│   │   ├── index.atom             // 入口 atom 组件[关键]
│   │   ├── index.mock.js          // mock 数据文件
│   │   └── List.atom          
│   └── common                     // 在多个页面中公共使用的模块
│       └── component              // 公共组件
│           └── Layout.atom        // 布局组件
└── static                         // 不需要进行模块化处理的 js
    └── mod.js                     // 一般我们都使用 npm 包的方式来引入开源库，不需要在这里添加；
                                   // 由于 mod.js 是我们的加载器，所以就在这里特殊处理。
```


### 如何做预渲染

1. atom 提供了 `Server Side Renderer` 功能，我们在后端需要使用我们提供的入口模板
1. 我们移除了对 `smarty` 模板的依赖，现在只使用纯 php 来做渲染模板。
1. 我们给后端提供了模板渲染的封装，方便集成。

#### 步骤

1. 安装 vip-server-renderer 的 php 渲染库

    在下载好 atom 的 php 库之后，在合适的位置引入：

    ```php
    require_once(__DIR__ . "/path/to/vip-server-renderer/php/server/Atom.class.php");
    ```

1. 使用 AtomWraper.class.php

    我们做了一个简易封装，使得 Atom 的模板管理更简单、更明确。

    你可以在[这里](https://github.com/jinzhubaofu/atom-fis-starter/blob/master/scripts/webserver/AtomWrapper.class.php)找到 AtomWrapper 的源码。

    > 请下载此源码，并在合适的位置引入

    AtomWrapper 的用法与 Smarty 非常相似，这里举个例子：

    ```php

    // 创建实例
    $atomWrapper = new AtomWrapper();

    // 设置模板目录
    // 我们会在模板目录下边查找模板文件和atom组件
    $atomWrapper->setTemplateDir('/模板目录的绝对路径');

    // 此处添加模板渲染所需要的数据，可以重复调用多次
    $atomWrapper->assign('title', 'hello atom!');
    $atomWrapper->assign(
        'list',
        array(
            array(
                'name' => 'vue',
                'like' => 100,
            ),
            array(
                'name' => 'atom',
                'like' => 101
            ),
        )
    );

    // 渲染模板和组件
    $atomWrapper->display(
        // 指定入口模板（相对路径，相对于模板目录）
        'relative/to/template/dir/my.php',
        // 指定atom组件（相对路径，相对于模板目录）
        'relative/to/template/dir/my.atom.php'
    );
    ```

此处，可以根据请求，路由到正确的 atom 组件和入口模板。我们建议的目录结构是：

1. 每个页面一个目录
2. 每个页面的`入口模板`是页面目录下的`index.php`
3. 每个页面的`入口atom组件`是**页面目录**下`index.atom.php`；


> 我们提供了一个简单的本地开发服务器，使用了 AtomWrapper，可供[参考](https://github.com/jinzhubaofu/atom-fis-starter/blob/master/scripts/webserver/index.php)

### atom 的根结点

我们使用固定的 HTML 属性 `[atom-root]` 来标识 atom 的组件的根挂载元素。

这个是在 `scripts/webserver/AtomWrapper.class.php` 和 `src/Todo/index.php` 中两处配合起来完成的。

**不建议在一个页面中使用多个 atom 根结点**

原因中在同一个页面中的多个 atom 根结点之间的数据和消息交互是互相隔离的；如果不能保证根结点之间没有关联，不要搞出多个根结点。

### atom 的布局组件

在我们有了 atom 组件之后，我们通过一个 `layout` 组件来完成布局，举个例子：

`layout.atom`:

```vue
<template>
    <main>
        <section>
            <slot name="main" />
        </section>
        <aside>
            <slot name="aside" />
        </aside>
    </main>
</template>
```

在我们的入口 atom 组件中使用它：

```vue
<template>
    <div>
        <app-layout>
            <div slot="main">
                <h4 class="title">hello, {{name}}；我是 index.atom。</h4>
                <todo-list :list="myList" @addLike="addLike" />
            </div>
            <div slot="aside">
                这里是侧边栏
            </div>
        </app-layout>
    </div>
</template>
```

### mock 数据

在此repo中，可以通过 `npm start` 开启一个本地的开发服务器。

此时，你可以在页面目录下放置一个 `index.mock.js` 文件来生成 mock 数据。

在这个 js 文件中，你可以直接返回数据：

```js
module.exports = {
    tplData: {
        // 业务数据
    },
    extData: {
        // 统计数据
    }
};
```

我们会上边这个数据来渲染页面。或者是返回一个函数，我们在渲染前会调用它。它可以返回一个 promise，来进行异步操作：

```js
const fetch = require('node-fetch');
const fs = require('fs');
module.exports = function (request) {
    return fs.existsSync('my-local-mock-data.json')
        ? require('my-local-mock-data.json')
        : fetch('http://remote-mock-server.com', {method: 'GET'})
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error(response.status);
            });
};
```
其中，如果返回的是个函数，那么它还可以拿到当前请求的 url；可以用来做一些更灵活的 mock 处理。
