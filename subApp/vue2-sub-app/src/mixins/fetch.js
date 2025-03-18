import { fetch } from '@/utils/tools.js';

export default {
  data() {
    return {
      data: null,
      error: null
    };
  },
  mounted() {

  },
  beforeDestroy() {

  },
  methods: {
    fetchData(url) {
      this.data = null;
      this.error = null;

      fetch(url)
        .then((res) => (this.data = res))
        .catch((err) => (this.error = err));
    }
  }
}