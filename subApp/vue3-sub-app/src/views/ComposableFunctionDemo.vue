<template>
  <div class="demo-container">
    <p>Mouse position is at: {{ x }}, {{ y }}</p>
     
    <div v-if="error">请求失败：{{ error }}</div>
    <div v-else-if="data">
      <pre>{{ data }}</pre>
    </div>
    <div v-else>Loading...</div>

    <button @click="changeUrl">url 重新传惨</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useMouse } from '@/composables/mouse.js';
import { useFetch } from '@/composables/fetch.js';

const { x, y } = useMouse();

const url = ref('/url');
const { data, error } = useFetch(url);

function changeUrl() {
  const num = Math.floor(Math.random() * 1000) + 1;
  url.value = `/url${num}`;
}
</script>