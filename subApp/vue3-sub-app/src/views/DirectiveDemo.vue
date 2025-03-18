<template>
    <div class="demo-container">
      <div v-color="'red'">自定义指令</div>
      <input v-model="directiveMsg" v-focus />
      <div class="drag-box">
        <div v-drag>拖拽我</div>
      </div>
      <p v-highlight>This sentence is important!</p>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const directiveMsg = ref('自定义指令');
</script>

<style scoped lang="less">
.drag-box {
  margin-top: 30px;
  margin-bottom: 30px;
  height: 300px;
  border: 1px solid red;
  position: relative;

  div {
    position: absolute;
    cursor: move;
    width: 100px;
    height: 100px;
    background: green;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
  }
}
</style>