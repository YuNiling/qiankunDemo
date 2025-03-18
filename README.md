# 项目内容
qiankun 项目开发
主应用：vue3 项目
子应用：vue2 项目、vue3 项目

## 开发进度
- [x] 1. vue-router
- [x] 2. 自定义指令
- [x] 3. 过滤器
- [x] 4. 全局属性/方法
- [x] 5. 事件总线 Event Bus
- [x] 6. Vuex
- [x] 7. “混入”(Mixin) ｜ “组合式函数”(Composables Function)

## vue2 全家桶目录结构
📦 my-vue2-project
├── 📂 public             # 公共静态资源 (不会被 Webpack 打包)
│   ├── favicon.ico       # 网站图标
│   └── index.html        # 入口 HTML 文件
├── 📂 src                # 源码目录
│   ├── 📂 api            # API 请求封装 (如 axios)
│   │   ├── index.js      # axios 实例
│   │   ├── user.js       # 用户 API
│   │   ├── auth.js       # 认证 API
│   │   └── ...           # 其他 API
│   ├── 📂 assets         # 静态资源 (如图片、样式)
│   │   ├── images/       # 图片
│   │   ├── styles/       # 全局样式
│   │   ├── variables.scss # 预处理 CSS 变量
│   ├── 📂 components     # 公共组件 (可复用)
│   │   ├── Button.vue    # 按钮组件
│   │   ├── Modal.vue     # 弹窗组件
│   │   ├── Navbar.vue    # 导航栏
│   │   └── ...           # 其他组件
│   ├── 📂 mixins         # Mixin 代码复用
│   │   ├── globalMixin.js # 全局 Mixin
│   │   └── authMixin.js   # 认证 Mixin
│   ├── 📂 plugins        # Vue 插件 (如 Element UI、Vuetify)
│   │   ├── element.js    # Element UI 配置
│   │   ├── vuetify.js    # Vuetify 配置
│   │   └── ...           # 其他插件
│   ├── 📂 router         # Vue Router 路由管理
│   │   ├── index.js      # 路由配置
│   │   ├── guards.js     # 路由守卫 (权限验证)
│   │   └── modules/      # 模块化的路由
│   ├── 📂 store          # Vuex 状态管理
│   │   ├── index.js      # Vuex 主 store
│   │   ├── modules/      # Vuex 模块化
│   │   │   ├── user.js   # 用户模块
│   │   │   ├── auth.js   # 认证模块
│   │   │   ├── settings.js # 设置模块
│   │   │   └── ...       # 其他模块
│   ├── 📂 views          # 页面视图组件
│   │   ├── Home.vue      # 首页
│   │   ├── Login.vue     # 登录页
│   │   ├── Dashboard.vue # 仪表盘
│   │   ├── Profile.vue   # 个人中心
│   │   └── ...           # 其他页面
│   ├── 📂 utils          # 工具函数
│   │   ├── helpers.js    # 通用帮助函数
│   │   ├── storage.js    # localStorage/sessionStorage 封装
│   │   └── ...           # 其他工具
│   ├── App.vue           # 根组件
│   ├── main.js           # 入口文件 (创建 Vue 实例)
│   ├── store.js          # Vuex 入口 (如果不使用模块化)
│   └── vue.config.js     # Vue CLI 配置文件
├── 📂 tests              # 测试目录 (单元测试、E2E 测试)
├── 📂 docs               # 项目文档
├── 📜 .env               # 环境变量文件
├── 📜 package.json       # 项目依赖和脚本
├── 📜 README.md          # 项目说明文档
└── 📜 .gitignore         # Git 忽略文件

## vue3 全家桶目录结构
📦 vue3-project
├── 📂 public             # 公共静态资源 (不会被 Webpack 打包)
│   ├── favicon.ico       # 网站图标
│   └── index.html        # 入口 HTML 文件
├── 📂 src                # 源码目录
│   ├── 📂 api            # API 请求封装 (如 axios)
│   │   ├── index.js      # 全局 axios 实例
│   │   ├── user.js       # 用户相关 API
│   │   ├── auth.js       # 认证相关 API
│   │   └── ...           # 其他 API
│   ├── 📂 assets         # 静态资源 (如图片、样式)
│   │   ├── images/       # 图片
│   │   ├── styles/       # 全局样式
│   │   └── variables.scss # 预处理 CSS 变量
│   ├── 📂 components     # 公共组件 (可复用)
│   │   ├── Button.vue    # 按钮组件
│   │   ├── Modal.vue     # 模态框组件
│   │   └── ...           # 其他组件
│   ├── 📂 composables    # 组合式 API (Vue 3 Hook 函数)
│   │   ├── useAuth.js    # 认证相关逻辑
│   │   ├── useTheme.js   # 主题切换逻辑
│   │   └── ...           # 其他逻辑
│   ├── 📂 layouts        # 页面布局 (如侧边栏+头部)
│   │   ├── DefaultLayout.vue   # 默认布局
│   │   ├── AdminLayout.vue     # 管理员布局
│   │   └── ...                 # 其他布局
│   ├── 📂 router         # Vue Router 路由管理
│   │   ├── index.js      # 路由配置
│   │   ├── guards.js     # 路由守卫 (导航守卫)
│   │   └── modules/      # 模块化的路由
│   ├── 📂 store          # Pinia/Vuex 状态管理
│   │   ├── index.js      # Vuex/Pinia 主入口
│   │   ├── user.js       # 用户模块
│   │   ├── auth.js       # 认证模块
│   │   └── ...           # 其他模块
│   ├── 📂 views          # 视图 (页面组件)
│   │   ├── Home.vue      # 首页
│   │   ├── Login.vue     # 登录页
│   │   ├── Dashboard.vue # 仪表盘
│   │   └── ...           # 其他页面
│   ├── 📂 utils          # 工具函数
│   │   ├── helpers.js    # 通用帮助函数
│   │   ├── storage.js    # localStorage/sessionStorage 封装
│   │   └── ...           # 其他工具
│   ├── App.vue           # 根组件
│   ├── main.js           # 入口文件 (创建 Vue 实例)
│   └── vite.config.js    # Vite 配置文件 (如用 Vite)
├── 📂 tests              # 测试目录 (如单元测试)
├── 📂 docs               # 项目文档
├── 📜 .env               # 环境变量文件
├── 📜 package.json       # 项目依赖和脚本
├── 📜 README.md          # 项目说明文档
└── 📜 .gitignore         # Git 忽略文件