<template>
  <div id="app">
    <h2>Vue2 子应用</h2>
    <router-link to="/homePage">Home</router-link>
    <router-link to="/aboutPage">About</router-link>

    <button @click="toVue3">跳转到vue3 子应用 about</button>

    <router-view></router-view>

    <input v-model="message" />
    <div>{{ message | capitalize }}</div>
  </div>
</template>

<script>
import baseMixin from '@/assets/utils/baseMixin.js';
export default {
  name: 'App',
  mixins: [baseMixin],
  components: {},
  data() {
    return {
      message: ''
    };
  },
  filters: {
    capitalize: function(value) {
      if (!value) return '';
      value = value.toString();
      return value.charAt(0).toUpperCase() + value.slice(1)
    }
  },
  mounted() {
    console.log(this.$router.currentRoute);
    if (this.$router.currentRoute.path === '/panel') {
      this.$router.push('/');
    }
  },
  created() {
    this.hello();
  },
  methods: {
    toVue3() {
      window.qiankunNavigate('/sub-app/vue3-demo/about');
    }
  }
}
</script>

<style scoped>
h2 {
  text-align: center;
}

a {
  margin: 0 20px;
}

button {
  color: #fff;
  background-color: rgb(64, 158, 255);
  border: 1px solid rgb(64, 158, 255);
  font-size: 14px;
  padding: 6px 20px;
  border-radius: 4px;
}
</style>