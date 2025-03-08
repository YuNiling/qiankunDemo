<template>
  <div class="demo-container">
    <div>原始日期：{{ date }}</div>
    <div>dayjs格式化日期：{{ formatDate1 }}</div>
    <div>formatDate格式化日期：{{ formatDate2 }}</div>
    <hr />
    <div>'min=1, max=10'，随机整数x = {{ num }}</div>
    <button @click="changeRandom">重新生成</button>
  </div>
</template>

<script>
export default {
  name: 'PrototypeDemo',
  data() {
    return {
      date: '2019-01-05',
      formatDate1: '',
      formatDate2: '',
      num: 0
    };
  },
  mounted() {
    this.formatDate1 = this.$dayjs(this.date).format('DD/MM/YYYY');
    this.formatDate2 = this.$tools.formatDate(this.date);
  },
  created() {
    
  },
  methods: {
    changeRandom() {
      this.num = this.$tools.randomNumber(1, 10);
    }
  }
}
</script>