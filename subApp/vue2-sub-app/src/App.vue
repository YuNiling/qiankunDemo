<template>
  <div>
    <div class="router-header">
      <button class="button-primary" @click="toVue3">跳转到vue3 子应用 about</button>
      <router-link class="router-link" to="/directiveDemo">自定义指令</router-link>
      <router-link class="router-link" to="/filterDemo">过滤器</router-link>
      <router-link class="router-link" to="/prototypeDemo">全局属性/方法</router-link>
      <router-link class="router-link" to="/eventBusDemo">事件总线</router-link>
      <router-link class="router-link" to="/vuexDemo">Vuex</router-link>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {},
  data() {
    return {

    };
  },
  mounted() {
    if (this.$router.currentRoute.path === '/panel') {
      this.$router.push('/');
    }
  },
  created() {

  },
  methods: {
    toVue3() {
      window.qiankunNavigate('/sub-app/vue3-demo/about');
    }
  }
}
</script>

<style scoped lang="less">
h2 {
  text-align: center;
  color: @primary-color;
}
</style>