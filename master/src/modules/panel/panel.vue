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
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, markRaw } from 'vue';
import { loadMicroApp, prefetchApps } from 'qiankun';
import themeList from '@/utils/theme.js';
import { useRouter } from 'vue-router';

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

onMounted(() => {
  menuChange(themeList[0]);
  preLoadApps();
});

onUnmounted(() => {
  microApp.value && microApp.value.unmount();
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
}
</style>