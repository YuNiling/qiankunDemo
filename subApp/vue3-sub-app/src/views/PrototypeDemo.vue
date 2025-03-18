<template>
  <div class="demo-container">
    <div>原始日期：{{ date }}</div>
    <div>dayjs格式化日期：{{ formatDate1 }}</div>
    <div>formatDate格式化日期：{{ formatDate2 }}</div>
    <div>formatDate格式化日期：{{ $tools.formatDate(date) }}</div>
    <hr />
    <div>'min=1, max=10'，随机整数x = {{ num }}</div>
    <button @click="changeRandom">重新生成</button>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue';

const instance = getCurrentInstance();

const date = ref('2019-01-05');
const formatDate1 = ref('');
const formatDate2 = ref('');
formatDate1.value = instance.appContext.config.globalProperties.$dayjs(date.value).format('DD/MM/YYYY');
formatDate2.value = instance.appContext.config.globalProperties.$tools.formatDate(date.value);

const num = ref(0);
function changeRandom() {
  num.value = instance.appContext.config.globalProperties.$tools.randomNumber(1, 10);
}
</script>