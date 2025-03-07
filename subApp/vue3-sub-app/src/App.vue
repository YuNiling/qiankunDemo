<template>
  <div class="header">
    <router-link to="/home">Home</router-link>
    <router-link to="/about">About</router-link>
    <router-link to="/directiveDemo">自定义指令</router-link>
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

  a {
    margin: 0 20px;
  }
}
</style>
