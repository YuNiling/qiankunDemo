<template>
  <div class="panel">
    <div class="header">
      <h1>主应用</h1>
    </div>
    <div class="container">
      <ul class="menu">
        <li 
          v-for="(menu, index) in themeList"  
          :key="index"
          class="menu-item" 
          :class="{
            'active': menu.name === activeMenu
          }"
          @click="menuChange(menu)"
        >
          {{ menu.label }}
        </li>
      </ul>
      <div class="content">
        <keep-alive>
          <component :is="activeComponent"></component>
        </keep-alive>
      </div>
    </div>
    <div class="dialog" v-if="eventBusReceivedMsg">
      <span class="close-icon" @click="closeEventBusDialog">x</span>
      <p>接收到的消息：{{ eventBusReceivedMsg }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, markRaw, getCurrentInstance } from 'vue';
import { loadMicroApp, prefetchApps } from 'qiankun';
import { useRouter } from 'vue-router';
import themeList from '@/assets/utils/theme.js';
import * as microAppsProps from '@/assets/utils/MicroApps.js';

const instance = getCurrentInstance();

const keepAliveArr = ref([]);
const activeMenu = ref('vue2-sub-app');
const menuChange = (menu) => {
  activeMenu.value = menu.name;
  loadApp(menu.name);
};

const activeComponent = ref(null);
const microApp = ref(null);
const loadApp = async (appName) => {
  if (microApp.value) {
    microApp.value.unmount(); //  卸载之前的子应用
  }

  const theme = themeList.find((v) => v.name === appName);

  if (!theme) {
    console.log('未知的子应用名称');
    return;
  }

  const loader = theme.component;
  const asyncComp  = (await loader()).default;
  activeComponent.value = markRaw(asyncComp);
  theme.props = Object.assign(theme.props, microAppsProps);
  microApp.value = loadMicroApp(theme);
};

// 预加载所有子应用
const preLoadApps = () => {
  const hasEntryThemeList = themeList.filter(v => v.entry);
  prefetchApps(hasEntryThemeList);
  hasEntryThemeList.map(v => {
    keepAliveArr.value.push(v.permission);
  });
};

const router = useRouter();
router.beforeEach((to, from, next) => {
  const toPath = to.fullPath;
  if (toPath.startsWith('/sub-app/')) {
    const theme = themeList.filter((v) => {
      return toPath.startsWith(v.props.routerBase);
    })
    if (theme) {
      menuChange(theme[0]);
    } else {
      next();
    }
  } else {
    next();
  }
});

const eventBusReceivedMsg = ref('');
const bus = instance.appContext.config.globalProperties.$bus;
bus.on('test-event', (data) => {
  eventBusReceivedMsg.value = data;
});
const closeEventBusDialog = () => {
  eventBusReceivedMsg.value = '';
};

onMounted(() => {
  menuChange(themeList[0]);
  preLoadApps();
});

onUnmounted(() => {
  microApp.value && microApp.value.unmount();
  bus.off('test-event');
});
</script>

<style scoped lang="less">
.panel {
  .header {
    text-align: center;
    padding: 15px 0;
    border-bottom: 1px solid @border-color;
  }
  
  .container {
    display: flex;
    height: calc(100vh - 79px);
  
    .menu {
      width: 200px;
      border-right: 1px solid @border-color;
  
      .menu-item {
        font-size: @font-size-base;
        padding: 15px 15px;
        color: @default-color;
        cursor: pointer;
        border-bottom: 1px solid @border-color;
  
        &.active {
          color: @primary-color;
        }
      }
    }
  
    .content {
      flex: 1;
    }
  }

  .dialog {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border: 1px solid @border-color;
    padding: 20px 30px;
    font-size: 14px;
    box-shadow: 0px -5px 5px rgba(0, 0, 0, .4);
    border-radius: 4px;

    .close-icon {
      position: absolute;
      right: -7px;
      top: -7px;
      display: inline-block;
      width: 15px;
      height: 15px;
      border-radius: 50%;
      background-color: red;
      color: #fff;
      font-size: 14px;
      text-align: center;
      line-height: 15px;
      cursor: pointer;
    }
  }
}
</style>