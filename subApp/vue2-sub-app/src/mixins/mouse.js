export default {
  data() {
    return {
      x: 0,
      y: 0
    };
  },
  mounted() {
    window.addEventListener('mousemove', this.mouseUpdate);
  },
  beforeDestroy() {
    window.removeEventListener('mousemove', this.mouseUpdate);
  },
  methods: {
    mouseUpdate(event) {
      this.x = event.pageX;
      this.y = event.pageY;
    }
  }
}