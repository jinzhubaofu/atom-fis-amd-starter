# atom-fis3-starter

使用 atom 和 fis3(amd模块产出)来创建网站应用的种子项目

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

#### 开发时构建(编译)

在本地开发时，我们使用以下命令进行构建：

```
npm run build:dev
```

此命令会把每个源码文件生成独立的构建产物，不进行压缩和合并，这有利于开发和调试。

另外，你可以开启监听模式，在修改源码后进行增量编译：

```
npm run watch
```

#### 上线前构建

在生成上线使用的构建产物时，可以使用以下命令：

```sh
npm run build:prod
```

上线前构建用于生成可应用于线上服务的构建产物。需要进行合并、压缩添加 md5 后续等等操作。

### 启动本地开发服务器

```sh
npm start
open http://localhost:9000
```

### 修改后自动构建

```sh
npm run watch
```

> 建议在开发时开启一个本地服务（npm start）再开一个自动构建（npm run watch）

## 开发指南

### 项目基础

此项目是多个页面的网站结构，支持服务器端预渲染。即可以应对多个URL地址直接提供不同的页面 HTML 内容；同时，页面间切换通过 Superframe 框架来实现异步加载渲染。


### 目录结构

```text
├── README.md
├── docs                           // 所有的文档应该放到这里
│   └── ide.md
├── fis-conf.js                    // fis3 构建的配置文件
├── package.json               
├── tools                          // 所有的本地工具在这个目录
│   └── webserver                  // 本地开发用的服务器在这里
│       ├── AtomWrapper.class.php  // 渲染 atom php 文件用的脚本
│       ├── get-mock-data.js       // 用于生成 mock 数据
│       ├── routes.json            // 用于配置文本开发环境的路由，即 url 路径与入口 atom 组件的对应关系
│       ├── router.php             // 简易的 php 路由功能实现
│       └── index.php              // 本地开发服务器的入口 php 文件
└── src                            // 所有的源码在这里
    ├── Home                       // 建议每个页面都用一个目录来承载
    │   ├── index.atom             // 入口 atom 组件[关键]
    │   ├── index.mock.js          // mock 数据文件
    │   └── List.atom          
    ├── Post                       // 建议每个页面都用一个目录来承载
    │   ├── index.php              // 入口模板[关键]
    │   ├── index.atom             // 入口 atom 组件[关键]
    │   ├── index.mock.js          // mock 数据文件
    │   └── List.atom          
    └── common                     // 在多个页面中公共使用的模块
        ├── php                    // 公共 php 相关文件
        │   └── index.php          // 所有的入口文件的模板，我们在构建时会按照此模板来给每个页面生成 template
        └── component              // 公共组件
            └── Layout.atom        // 布局组件
```

其中有几条规范请务必注意：

1. 单个页面所使用的所有代码**必须**放置在同一个目录中

    举例：页面 Home 所有的代码应当放置在 `/src/Home` 目录下。

    页面的目录命名推荐以下两种方案：

    1. SomePage
    2. some-page

    但请注意同一项目下必须统一使用一种格式

2. 多个页面同时使用的模块，放置在 `/src/common` 目录中

    例如，公共布局组件 `Layout.atom` 需要放置在 `/src/common/component/Layout.atom`。

    **不允许** A 页面引用 B 页面中的模块。例如：

    `/src/Home/List.js` 不允许引入 `/src/Post/guid.js`。应当将 `/src/Post/guid.js` 放置到 `/src/common/util/guid.js`。

3. 业务模块代码中引入模块时**必须**使用相对路径

    即：

    ```js
    import {test} from './test';
    import '../../common/js/a';
    ```

4. 可以使用多级目录，对页面进行分类

    例如『我的』功能又分成『个人信息』和『我的喜欢』两个页面，那么可以参考以下目录结构：

    ```text
    My
    ├── Info
    │   └── index.atom
    ├── Like
    │   └── index.atom
    └── common                   // 在『我的』分类下多个页面共享模块
        └── component
            └── Foo.atom
    ```

    其中，`My` 目录下的页面也遵守上述 [1] [2] [3] 规范。

### 解决方案

对于服务器端预渲染，即用户首次打开指定页面时，我们能够提供完整的 HTML；此处的 HTML 主要包含两个部分：

1. 业务主体内容 (**atom 组件** 负责)

    此部分是整个页面的主要内容，也是用户最关注的内容。

    此部分的内容我们用 atom 组件来编写，并通过 atom ssr 来生成 html。一般来讲，atom 组件只关注业务本身，输出的内容并不涉及 html 必备的 `head` / `script` / `link` 等内容。这些内容我们通过下边的 **页面模板** 来完成

2. 此页面的 HTML 的框架、脚本、统计等辅助功能（**页面模板** 负责)

    我们知道除了业务内容以外，一个可用的页面必需满足一定的 html 结构，比如：

    ```html
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="utf-8">
            <title><!--标题--></title>
            <!-- seo 相关的 meta -->
            <!-- 外链样式表 -->
            <!-- 性能统计 -->
        </head>
        <body>
            <!-- 业务 html 内容 (atom组件预渲染完成)-->
            <!-- 后端数据输出 -->
            <!-- 业务外链脚本 -->
            <!-- 启动脚本 -->
            <!-- 常规统计 -->
        </body>
    </html>
    ```

    通常一个网站内的绝大部分页面都应该拥有相类似的结构，应该可以通过同一个模板来完成。
    但考虑到前端缓存管理的特殊性，即前端资源通常会使用 md5 值后缀的方案来解决缓存问题。例如，我们一般都会将文件内容的 md5 值加入到文件名中，在页面中引用唯一的 url 地址：

    ```html
    <link rel="stylesheet" href="https://s1.bdstatic.com/xxx.12345678.css">
    <script src="https://s1.bdstatic.com/xxx.12345678.js"></script>
    <img src="https://s1.bdstatic.com/xxx.12345678.png" alt="">
    ```

    使用 md5 值的好处在于不同内容会产生不同的 url，即可以在需要更新时最方便地进行更新（更换url地址），也可以在无更新时最大限度地利用缓存。

    这对于我们的 **页面模板** 提出了更多的要求，也就是说后端需要知道当前页面的前端资源的 md5 情况，才能给出正确的 html 输出。对于大型网站来说，每个页面中的脚本、样式等静态资源都是不一样的。如果我们坚持所有页面都使用同一个模板，就很难完成了。

    >> 如果坚持只使用一个模板，那么在这个模板进行渲染时，需要得到页面与静态资源之间的对照关系，再进行输出；
    >> 如果考虑到 AMD 加载器配置，那么情况会更为复杂；
    >> 同时可能会对后端性能造成影响。

    对于这种情况，我们的方案是对每个页面都提供一份单独的 **页面模板**。这个特定的 **页面模板** 是通过前端构建工具生成的，它所需要的前端静态资源在构建过程中，已经被内置到此模板中。在后端进行渲染时，不需要关注前端静态资源的维护，只需要关注后端数据的提供即可了。

    因此，我们所有的开发、部署都是依赖于构建产物的。下面我们来了解一下构建产物的结构。

### 构建产物

构建产物目录结构如下所述：

```text
├── bundle                           // 合并后的 bundle 存放在此目录
│   ├── biz_0c368bf.js               // 所有业务代码都合并在此 bundle 中（可根据需要进行拆解、调整）
│   ├── biz_745d4c7.css        
│   └── vendor_ec6b747.js            // 所有的第三方依赖都合并在此 bundle 中
├── map.json                         // fis 构建过程中拿到的所有静态资源数据
├── static                           // 未合并的静态资源文件
│   ├── @baidu                       // 第三方依赖包
│   │   ├── esl
│   │   ├── esl.js
│   │   ├── vip-server-renderer
│   │   └── vip-server-renderer.js
│   ├── @searchfe                    // 第三方依赖包
│   │   ├── assert
│   │   ├── assert.js
│   │   ├── promise
│   │   └── promise.js
│   ├── ralltiir
│   │   ├── dist
│   │   └── src
│   ├── ralltiir-application
│   │   ├── service.js
│   │   ├── utils
│   │   └── view
│   ├── ralltiir-application.js
│   ├── ralltiir.js
│   └── atom-site                    // 业务模块代码存放目录
│       ├── Home                     // 页面 Home
│       ├── Post                     // 页面 Post
│       ├── Tag                      // 页面 Tag
│       └── common
└── template                         // 用于进行服务端预渲染的 php 文件
    ├── Home
    │   ├── Post.atom.php
    │   ├── index.atom.php           // 页面主 atom 组件
    │   └── index.template.php       // 页面模板
    ├── Post
    │   ├── index.atom.php           // 页面主 atom 组件
    │   └── index.template.php       // 页面模板
    ├── Tag
    │   ├── index.atom.php           // 页面主 atom 组件
    │   └── index.template.php       // 页面模板
    └── common
        ├── component                // 共用组件的 php 文件
        │   └── Layout.atom.php      // 共用布局组件的 php 文件
        └── php                      // 共用 php 模块
```

构建产物分为三个目录：

1. `template` 下是给后端进行预渲染使用的；

    其中，template 下的每个页面都有一个目录，目录中会包含两个文件：

    1. `index.template.php` => 构建产生的 **页面模板**

        此文件中会包含每个页面的前端资源配置

    2. `index.atom.php` => atom 组件的 php 文件

2. `static` 是未合并版本的 `js` 模块；

    可以注意到，业务代码都被放置在 `atom-site` 目录下。这个名称是可以根据业务名称进行调整的，比如可以改成 `sport` / `work` / `daily-life` 等；

    这个值可以在 `package.json` 的 `project.moduleName` 字段进行修改，再次运行构建即可。

    @NOTICE: 业务模块 `atom-site` 目录中的所有模块都是具名的 AMD 格式，即：

    ```js
    define('atom-site/module-a', ['atom-site/common/js/dep-a', 'dep-b'], function (a, b) {
        // ...
    });
    ```

3. `bundle` 目录

    `bundle` 目录用来放置合并版本的 js / css 资源。

    @NOTICE 在 `npm run build:dev` 模式下不会生成此目录，只有 `npm run build:prod` 时才会生成。

    因此，我们在开发模式下是没有合并版本的 bundle 资源可以使用的。

    此时，前端资源是通过 AMD 加载器来加载的(这里使用的是 `esl` )。

    > atom 的 css 是使用了 预渲染的 css 结果，直接在 style 标签中输出的


    @NOTICE 每个 bundle 文件是若干个具名 AMD 模块的连接版本

### 如何使用 atom 进行预渲染(服务器端setup指南)

**AKA: SERVER SIDE SETUP**

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
        // 指定页面模板（相对路径，相对于模板目录）
        'relative/to/template/dir/my.php',
        // 指定atom组件（相对路径，相对于模板目录）
        'relative/to/template/dir/my.atom.php'
    );
    ```

此处，可以根据请求，路由到正确的 atom 组件和入口模板。我们建议的目录结构是：

1. 每个页面一个目录
2. 每个页面的 `入口模板` 是页面目录下的 `index.template.php`；
3. 每个页面的 `入口atom组件` 是 **页面目录** 下 `index.atom.php`；

对于后端服务来讲（php开发同学），除了 `atom` 的 php runtime 之外，我们还需要提供构建产物中的 `template` 目录。

> 我们提供了一个简单的本地开发服务器，使用了 AtomWrapper，可供[参考](https://github.com/jinzhubaofu/atom-fis-starter/blob/master/tools/webserver/index.php)

### atom 的根结点

我们使用固定的 HTML 属性 `[atom-root]` 来标识 atom 的组件的根挂载元素。

这个是在 `tools/webserver/AtomWrapper.class.php` 和 `output/static/Home/index.template.php` 中两处配合起来完成的。

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

### 使用第三方依赖库

1. 首先，必须通过 [apmjs](https://github.com/apmjs/apmjs) 来安装第三方依赖包

    ```sh
    # 安装 apmjs 工具
    npm install -g apmjs
    # 使用 apmjs 安装依赖包
    apmjs install --save zepto
    ```

2. 其次，你需要手动修改 `amd-conf.js` 文件，按着 AMD 标准配置来指定 `paths` / `packages`。

    由于我们的构建工具 fis3 在解析 amd 模块的依赖时，需要对顶级模块进行配置才能找到依赖包。因此，需要在 `amd-conf.js` 中提供。在 `fis-conf.js` 构建时会读取它。

    以添加 zepto 库举例：

    1. 通过 `apmjs install zepto` 来添加 zepto，那么它会被安装在 `node_modules/zepto`，其主文件是 `node_modules/zepto/dist/zepto.js`。

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

### mock 数据

在此 repo 中，可以通过 `npm start` 开启一个本地的开发服务器。

此时，你可以在页面目录下放置一个 `index.mock.js` 文件来生成 mock 数据。

在这个 js 文件中，你可以直接返回数据，例如在 /src/Home/index.mock.js 中：

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

### 使用 data_modify.php

__不推荐使用__

在获得到数据之后，在进入 atom 的预渲染之前，我们还可以使用 `data_modify.php` 来修改数据。

`data_modify.php` 需要放置在入口 atom 组件同一目录下。运行上下文为 AtomWrapper 实例，比如：

```php
$user = $this->data['user'];
$this->assign('username', $user['name']);
```

> 还可以参考 `/src/My/Info/data_modify.php`

### 其他注意事项

#### AMD 模块加载器

我们使用更轻、更快、更强大的 [esl](https://github.com/ecomfe/esl) 作为 AMD 加载器。

#### 非 atom 的 JS 文件模块编写

在本项目中，`atom` 文件是你主要编写的部分。`atom` 会自动被转译成 `amd` 格式不需要额外关注。

在本项目中，所有的模块请按照 `amd` 模块化规范来编写。

#### 非 atom 文件中的 js 使用 babel 进行转译

目前我们已经集成了 babel 转译工具，默认使用了 es2015 的 preset 对 js 进行转译。

#### 在本地添加路由配置

我们可以在本地开发时，就配置与线上类似的 url 格式。只需要在 `tools/webserver/routes.json` 中添加一条配置即可：

```json
{
    "/": "Home/index.atom",
    "/post": "Post/index.atom",
    "/my/info": "My/Info/index.atom",
    "/my/like": "My/Like/index.atom"
}
```

另外，为了使 `ralltiir` 能够进行异步渲染，还需要对它进行路由配置，修改 `/src/common/routes.js`：

```js
export default [
    {
        pattern: '/'
    },
    {
        pattern: '/post'
    },
    {
        pattern: '/my/like'
    },
    {
        pattern: '/my/info'
    }
];
```

#### 通过主入口 atom 组件的 `props` 来限定页面中的数据输入

由于我们的同构技术要求，需要将后端的数据输出在前端，来给前端的 atom 渲染出与预渲染一致的 dom 结构。

但有时后端提供的数据会很多，其中有些数据可以不输出到页面上。例如，后端数据为：

```js
{
    // 需要
    list: [
        {
            id: 1,
            title: 'xxx'
        },
        {
            id: 2,
            title: 'yyy'
        }
    ],
    // 不需要
    user: {
        name: 'xxx'
    }
}
```

我们只需要其中的 list，而不需要 user，那么在 index.atom 的 config 段落的 props 可以进行指定，只输出指定的数据项：

```html
<script type="config">
{
    props: ['list']
}
</script>
```

那么在预渲染输出的 html 中我们只会将 `list` 数据输出。

> `list` 中的无用数据无法进行过滤。可以与 RD 同学进行沟通，不要输出无用数据；也可以考虑 data_modify.php 来进行清理，但不推荐。


#### 生成 bundle 的一般指导原则

bundle 的配置与业务情况息息相关，需要根据业务来进行细化调整。但一般遵守几个原则：

1. 第三包依赖包一般单独打包

    这部分资源一般不会发生变化，合并成一个包之后利用缓存、CDN等优化可以最大限度地节省流量。因此一般推荐一个 bundle/vendor.js

2. 合并包不宜过大，一般在 200KB（非 gzip）左右为宜

    200KB只是一般意义上的 tcp 链接数与下载速度的最优值。如果 bundle 超过 200KB 很多，请适当拆分。如果 bundle 体积未达到 200KB 请统一合并成一个 bundle。
