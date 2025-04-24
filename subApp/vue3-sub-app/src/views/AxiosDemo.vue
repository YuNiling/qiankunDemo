<template>
  <h1>axiosDemo</h1>
  <button @click="getUserInfoEvent">获取用户信息</button>
  <template v-if="!error1">
    <div v-for="item in userInfo" :key="item.id" class="user-info">
      <p>{{ item.id }}: {{ item.name }}-{{ item.age }}</p>
    </div>
  </template>
  <template v-else>
    <p class="error">{{ error1 }}</p>
  </template>
  <button @click="getUserInfoByIdEvent">获取用户信息ById</button>
  <template v-if="!error2">
    <p v-if="user">{{ user.id }}: {{ user.name }}-{{ user.age }}</p>
  </template>
  <template v-else>
    <p class="error">{{ error2 }}</p>
  </template>
  <button @click="addUserEvent">添加用户</button>
  <template v-if="!error3">
    <div v-for="item in userInfo" :key="item.id" class="user-info">
      <p>{{ item.id }}: {{ item.name }}-{{ item.age }}</p>
    </div>
  </template>
  <template v-else>
    <p class="error">{{ error3 }}</p>
  </template>
  <div>
    <input type="text" v-model="keyword" />
    <p v-if="user4">{{ user4.id }}: {{ user4.name }}-{{ user4.age }}</p>
    <p v-if="error4" class="error">{{ error4 }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { getUserInfo, getUserInfoById, addUser } from '@/api/api';
import type { UserInfo } from '@/types';

const userInfo = ref<UserInfo[]>([]);
const error1 = ref<string>('');
const getUserInfoEvent = () => {
  getUserInfo()
    .then((res) => {
      if (res.code === 200) {
        userInfo.value = res.data;
      } else {
        error1.value = res.message;
      }
    })
    .catch((err) => {
      error1.value = err;
    });
};

const user = ref<UserInfo | null>(null);
const error2 = ref<string>('');
const getUserInfoByIdEvent = () => {
  getUserInfoById(2)
    .then((res) => {
      console.log('res2', res);
      if (res.code === 200) {
        user.value = res.data;
      } else {
        error2.value = res.message;
      }
    })
    .catch((err) => {
      error2.value = err;
    });
};

const error3 = ref<string>('');
const addUserEvent = () => {
  addUser({
    id: 12,
    name: '张三',
    age: 18
  })
    .then((res) => {
      console.log('res', res);
      if (res.code === 200) {
        userInfo.value.push(res.data);
      } else {
        error3.value = res.message;
      }
    })
    .catch((err) => {
      error3.value = err;
    });
};

const keyword = ref<string>('');
const user4 = ref<UserInfo | null>(null);
const error4 = ref<string>('');
watch(
  keyword,
  (newVal) => {
    if (newVal.trim()) {
      getUserInfoById(Number(newVal.trim())) 
        .then((res) => {
          console.log('res', res);
          if (res.code === 200) {
            user4.value = res.data;
          } else {
            error4.value = res.message;
          }
        })
        .catch(err => {
          error4.value = err;
        })
    }
  }
);
</script>

<style scoped lang="less">
.error {
  color: red;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>

