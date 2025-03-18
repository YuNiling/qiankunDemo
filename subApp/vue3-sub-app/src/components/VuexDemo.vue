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

<script setup>
import { ref, computed, watch, inject } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const rootState = inject('rootState');

const title = computed(() => rootState.vue3Module.title);
const changeTitle = () => store.commit('vue3Module/changeTitle');

const hphm = computed(() => rootState.vue3Module.car.hphm);
const color = computed(() => rootState.vue3Module.car.color);
const changeHphm = () => store.commit('vue3Module/car/changeHphm');
const changeColor = () => store.commit('vue3Module/car/changeColor');

const role = computed(() => rootState.role);
const setRole = () => store.commit('setRole');

const isLoggedIn = computed(() => rootState.auth?.isLoggedIn);
const login = () => store.commit('auth/login');
const logout = () => store.commit('auth/logout');
function toggleLogin() {
  if (isLoggedIn.value) {
    logout();
  } else {
    login();
  }
}

const name = computed(() => rootState.user.name);
const age = computed(() => rootState.user.age);
const updateName = () => store.commit('user/updateName');
const updateAge = () => store.commit('user/updateAge');

const theme = computed(() => rootState.settings.theme);
const toggleTheme = () => store.commit('settings/toggleTheme');
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