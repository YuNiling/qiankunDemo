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

<script>
import mouseMixin from '@/mixins/mouse.js';
import fetchMixin from '@/mixins/fetch.js';

export default {
  name: 'MixinDemo',
  mixins: [mouseMixin, fetchMixin],
  data() {
    return {
      url: '/url'
    };
  },
  mounted() {

  },
  created() {

  },
  methods: {
    changeUrl() {
      const num = Math.floor(Math.random() * 1000) + 1;
      this.url = `/url${num}`;
      this.fetchData(this.url);
    }
  }
}
</script>