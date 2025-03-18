<template>
  <div class="demo-container">
    <div class="box">
      <h2>子模块</h2>
      <div>title：{{ title }} <a @click="changeTitle">切换</a></div>
    </div>
    <div class="box">
      <h2>子模块的子模块</h2>
      <div>hphm：{{ hphm }} <a @click="changeHphm">切换</a></div>
      <div>color：{{ color }} <a @click="changeColor">切换</a></div>
    </div>
    <div class="box">
      <h2>父模块</h2>
      <div>角色：{{ role }} <a @click="setRole">切换</a></div>
    </div>
    <div class="box">
      <h2>父模块的子模块</h2>
      <div v-if="isLoggedIn">
        <div class="form">
          <div class="title">系统信息<a @click="toggleLogin">登出</a></div>
          <table>
            <tr>
              <td>姓名：</td>
              <td>{{ name }}</td>
              <td><a @click="updateName">修改</a></td>
            </tr>
            <tr>
              <td>年龄：</td>
              <td>{{ age }}</td>
              <td><a @click="updateAge">修改</a></td>
            </tr>
            <tr>
              <td>主题：</td>
              <td>{{ theme }}</td>
              <td><a @click="toggleTheme">修改</a></td>
            </tr>
          </table>
        </div>
      </div>
      <div v-else>
        <a @click="toggleLogin">登陆</a>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'VuexDemo',
  data() {
    return {
     
    };
  },
  computed: {
    ...mapState('vue2Module', ['title']),
    ...mapState('vue2Module/car', ['hphm', 'color']),
    ...mapState('auth', ['isLoggedIn']),
    ...mapState('user', ['name', 'age']),
    ...mapState('settings', ['theme']),
    ...mapState(['role']),
  },
  watch: {

  },
  mounted() {

  },
  created() {

  },
  methods: {
    ...mapMutations('vue2Module', ['changeTitle']),
    ...mapMutations('vue2Module/car', ['changeHphm', 'changeColor']),
    ...mapMutations('auth', ['login', 'logout']),
    ...mapMutations('user', ['updateName', 'updateAge']),
    ...mapMutations('settings', ['toggleTheme']),
    ...mapMutations(['setRole']),
    toggleLogin() {
      if (this.isLoggedIn) {
        this.logout();
      } else {
        this.login();
      }
    }
  }
}
</script>

<style scoped lang="less">
a {
  color: @primary-color;
  cursor: pointer;
  margin-left: 5px;
}

td {
  width: 100px;
}

.box {
  border: 1px solid blue;
  margin-bottom: 10px;
}
</style>