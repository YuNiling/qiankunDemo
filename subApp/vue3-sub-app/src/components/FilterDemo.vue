<template>
  <div class="demo-container">
    <div>原始文本：{{ msg }}</div>
    <div>格式化文本：{{ $capitalize(msg) }}</div>
    <hr />
    <div>原始价格：{{ price }}</div>
    <div>格式化价格：{{ $currency(price) }}</div>
    <div>打八折后再格式化价格：{{ $currency($discount(price, 0.8)) }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const msg = ref('hello vue3');
const price = ref(1000);
</script>