import { createRouter, createWebHistory } from "vue-router";

// 定义路由
const routes = [
  {
    path: '/',
    redirect: '/panel'
  },
  {
    path: '/panel',
    name: 'Panel',
    component: () => import('@/views/panel.vue'),
  },
  // 通配符路由，用于匹配子应用的路由
  {
    path: '/sub-app/:pathMatch(.*)*',
    component: () => import('@/views/panel.vue'),
  }
];

// 创建路由实例
const router = createRouter({
  history: createWebHistory(), // 使用 HTML5 History 模式
  routes,
});

window.qiankunNavigate = (path) => {
  router.push(path);
};

// 监听主应用的路由变化
// router.afterEach((to, from) => {
//   console.log('to', to, from);
//   // 将主应用的路由变化通知给子应用
//   window.dispatchEvent(new CustomEvent('mainAppRouteChange', { detail: to.path }));
// });

export default router;