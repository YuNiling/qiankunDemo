<template>
  <div class="router-header">
    <router-link class="router-link" to="/directiveDemo">自定义指令</router-link>
    <router-link class="router-link" to="/filterDemo">过滤器</router-link>
    <router-link class="router-link" to="/prototypeDemo">全局属性/方法</router-link>
    <router-link class="router-link" to="/eventBusDemo">事件总线</router-link>
    <router-link class="router-link" to="/vuexDemo">Vuex</router-link>
  </div>

  <router-view></router-view>
</template>

<script setup>
</script>

<style scoped lang="less">
.header {
  height: 40px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid @border-color;
}
</style>
