<template>
  <div>
    <el-button type="primary">按钮</el-button>
    <img :src="imgPath1" alt="" />
    <img :src="imgPath2" alt="" />
    <img :src="imgPath3" alt="" />
    <img :src="imgPath4" alt="" />
    <img :src="imgPath5" alt="" />
  </div>
</template>

<script setup lang="ts">
const imgPath1 = new URL('@/assets/images/1-8.5.jpg', import.meta.url).href;
const imgPath2 = new URL('@/assets/images/2-2.7.jpg', import.meta.url).href;
const imgPath3 = new URL('@/assets/images/3-4.4.png', import.meta.url).href;
const imgPath4 = new URL('@/assets/images/4-1.3.jpg', import.meta.url).href;
const imgPath5 = new URL('@/assets/images/5-11.1.jpg', import.meta.url).href;
</script>

<style lang="sass" scoped>
.el-button
  background-color: $pc--primary-color
</style>

<style lang="less" scoped>
img {
  width: 100px;
  height: 100px;
}
</style>