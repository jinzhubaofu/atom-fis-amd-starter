# atom-fis3-starter

使用 atom 和 fis3(amd模块产出)来创建网站应用的种子项目

## 上手指南

### 前置条件

1. NodeJS(>=6.0)
2. php(>=5.4)
3. apm

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

> 建议在开发时开启一个本地服务（npm start）再开一个自动构建（npm run watch）

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
└── src                            // 所有的源码在这里
    ├── Todo                       // 建议每个页面都用一个目录来承载
    │   ├── index.php              // 入口模板[关键]
    │   ├── index.atom             // 入口 atom 组件[关键]
    │   ├── index.mock.js          // mock 数据文件
    │   └── List.atom          
    └── common                     // 在多个页面中公共使用的模块
        └── component              // 公共组件
            └── Layout.atom        // 布局组件
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

### AMD模块相关

#### AMD 模块加载器

我们使用更轻、更快、更强大的 [esl](https://github.com/ecomfe/esl) 作为 AMD 加载器。

#### 非 atom 的 JS 文件模块编写

在本项目中，所有的模块请按照 `amd` 模块化规范来编写。`atom` 文件会自动被转译成 `amd` 格式不需要额外关注。

#### 使用第三方依赖库

如果添加了第三方依赖库，你需要手动修改 `amd-conf.js` 文件，按着 AMD 标准配置来指定 `paths` / `packages`。在 `fis3` 构建时会读取 `amd-conf.js`，否则将无法定位第三方依赖库地址。

以添加 zepto 库举例：

1. 假设你通过 `npm install zepto` 来添加 zepto，那么它会被安装在 `node_modules/zepto`，其主文件是 `node_modules/zepto/dist/zepto.js`
2. 你需要在 `amd-conf.js` 中的 `paths` 字段中添加上 zept 的配置：

    ```js
    {
        paths: {
            zepto: 'node_modules/zepto/dist/zepto'
        }
    }
    ```
3. 现在你就可以在业务代码里使用 `zepto` 了

    ```js
    import $ from 'zepto';
    ```

### 非 atom 文件中的 js 使用 babel 进行转译

这个请参考 fis 官网中 babel 相关的插件，自行取舍
