import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/filterDemo'
  },
  {
    path: '/directiveDemo',
    name: 'DirectiveDemo',
    component: () =>  import('@/components/DirectiveDemo.vue')
  },
  {
    path: '/filterDemo',
    name: 'FilterDemo',
    component: () =>  import('@/components/FilterDemo.vue')
  },
  {
    path: '/prototypeDemo',
    name: 'PrototypeDemo',
    component: () =>  import('@/components/PrototypeDemo.vue')
  },
  {
    path: '/eventBusDemo',
    name: 'EventBusDemo',
    component: () =>  import('@/components/EventBusDemo.vue')
  }
];

const router = new VueRouter({
  base: window.__POWERED_BY_QIANKUN__ ? '/sub-app/vue2-demo/' : '/',
  mode: 'history',
  routes
});

// 全局前置守卫
router.beforeEach((to, from, next) => {
  // console.log(`从 ${from.name} 页面 跳转到 ${to.name} 页面`);
  next();
});

export default router;