<template>
    <div class="directive-demo-container">
      <h3>自定义指令</h3>
      <div v-color="'red'">自定义指令</div>
      <input v-model="directiveMsg" v-focus />
      <div class="drag-box">
        <div v-drag>拖拽我</div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'DirectiveDemo',
  data() {
    return {
      directiveMsg: '自定义指令'
    };
  },
  mounted() {

  },
  created() {
    
  },
  methods: {

  }
}
</script>

<style scoped lang="less">
.directive-demo-container {
  height: calc(100vh - 122px);
}

.drag-box {
  margin-top: 30px;
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