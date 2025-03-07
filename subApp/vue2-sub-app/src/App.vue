<template>
  <div>
    <div class="header">
      <router-link to="/homePage">Home</router-link>
      <router-link to="/aboutPage">About</router-link>
      <router-link to="/directiveDemo">自定义指令</router-link>
      <button @click="toVue3">跳转到vue3 子应用 about</button>
    </div>
    <router-view></router-view>

    <!-- <input v-model="message" /> -->
    <!-- <div>{{ message | capitalize }}</div> -->

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
      message: '',
      directiveMsg: '自定义指令'
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

<style scoped lang="less">
h2 {
  text-align: center;
  color: @primary-color;
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

.header {
  height: 40px;
  display: flex;
  align-items: center;
}
</style>