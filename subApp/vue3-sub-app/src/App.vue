<template>
  <h2>Vue3 子应用</h2>
  <router-link to="/home">Home</router-link>
  <router-link to="/about">About</router-link>

  <router-view></router-view>
</template>

<script setup>
</script>

<style scoped>
h2 {
  text-align: center;
}

a {
  margin: 0 20px;
}
</style>
