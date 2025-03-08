<template>
  <div class="demo-container">
    <input v-model="msg" />
    <button @click="sendEvent">发送消息</button>
  </div>
</template>

<script>
export default {
  name: 'EventBusDemo',
  data() {
    return {
      msg: 'Hello from Vue 2 !'
    };
  },
  mounted() {

  },
  created() {
    
  },
  methods: {
    sendEvent() {
      this.$bus.emit('test-event', this.msg);
    }
  }
}
</script>