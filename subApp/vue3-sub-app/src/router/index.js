import { createRouter, createWebHistory } from 'vue-router';
import { qiankunWindow } from 'vite-plugin-qiankun/dist/helper';

const routes = [
  {
    path: '/',
    redirect: '/vantUploaderDemo',
  },
  {
    path: '/axiosDemo',
    name: 'AxiosDemo',
    component: () => import('@/views/AxiosDemo.vue'),
  },
  {
    path: '/directiveDemo',
    name: 'DirectiveDemo',
    component: () => import('@/views/DirectiveDemo.vue')
  },
  {
    path: '/filterDemo',
    name: 'FilterDemo',
    component: () => import('@/views/FilterDemo.vue')
  },
  {
    path: '/prototypeDemo',
    name: 'PrototypeDemo',
    component: () => import('@/views/PrototypeDemo.vue')
  },
  {
    path: '/eventBusDemo',
    name: 'EventBusDemo',
    component: () => import('@/views/EventBusDemo.vue')
  },
  {
    path: '/vuexDemo',
    name: 'VuexDemo',
    component: () => import('@/views/VuexDemo.vue')
  },
  {
    path: '/composableFunctionDemo',
    name: 'ComposableFunctionDemo',
    component: () => import('@/views/ComposableFunctionDemo.vue')
  },
  {
    path: '/vant4Demo',
    name: 'Vant4Demo',
    component: () => import('@/views/Vant4Demo.vue')
  },
  {
    path: '/elementPlusDemo',
    name: 'ElementPlusDemo',
    component: () => import('@/views/ElementPlusDemo.vue')
  },
  {
    path: '/axiosDemo',
    name: 'AxiosDemo',
    component: () => import('@/views/AxiosDemo.vue')
  },
  {
    path: '/vantUploaderDemo',
    name: 'VantUploaderDemo',
    component: () => import('@/views/VantUploaderDemo.vue')
  },
  {
    path: '/imageCanvasRotate',
    name: 'ImageCanvasRotate',
    component: () => import('@/views/ImageCanvasRotate.vue')
  },
  {
    path: '/trackPlayDemo',
    name: 'TrackPlayDemo',
    component: () => import('@/views/TrackPlayDemo.vue')
  },
  {
    path: '/SQLModelDemo',
    name: 'SQLModelDemo',
    component: () => import('@/views/SQLModelDemo.vue')
  }
];

const router = createRouter({
  history: createWebHistory(qiankunWindow.__POWERED_BY_QIANKUN__ ? '/sub-app/vue3-demo/' : '/'),
  routes
});

// 全局前置守卫
// router.beforeEach((to, from, next) => {
//   // console.log(`从 ${from.name} 页面 跳转到 ${to.name} 页面`);
//   let token = localStorage.getItem('token');
//   if (token) {
//     next();
//   } else {
//     // window.location.href = "/login";
//   }
// });

export default router;