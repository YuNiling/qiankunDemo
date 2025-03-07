import { createRouter, createWebHistory } from 'vue-router';
import { qiankunWindow } from 'vite-plugin-qiankun/dist/helper';

const routes = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/components/Home.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/components/About.vue')
  },
  {
    path: '/directiveDemo',
    name: 'DirectiveDemo',
    component: () =>  import('@/components/DirectiveDemo.vue')
  }
];


const router = createRouter({
  history: createWebHistory(qiankunWindow.__POWERED_BY_QIANKUN__ ? '/sub-app/vue3-demo/' : '/'),
  routes
});

// // 全局前置守卫
// router.beforeEach((to, from, next) => {
//   // console.log(`从 ${from.name} 页面 跳转到 ${to.name} 页面`);
//   next();
// });

export default router;