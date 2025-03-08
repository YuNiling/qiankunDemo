<template>
  <div class="demo-container">
    <input v-model="msg" />
    <button @click="sendEvent">发送消息</button>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue';

const instance = getCurrentInstance();

const msg = ref('Hello from Vue 3 !');
const bus = instance.appContext.config.globalProperties.$bus;
function sendEvent() {
  bus.emit('test-event', msg.value);
}
</script>