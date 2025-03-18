<template>
  <div class="demo-container">
    <div>原始文本：{{ msg }}</div>
    <div>格式化文本：{{ msg | capitalize }}</div>
    <hr />
    <div>原始价格：{{ price }}</div>
    <div>格式化价格：{{ price | currency }}</div>
    <div>打八折后再格式化价格：{{ price | discount(0.8) | currency }}</div>
  </div>
</template>

<script>
export default {
  name: 'FilterDemo',
  data() {
    return {
      msg: 'hello vue2',
      price: 1000
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