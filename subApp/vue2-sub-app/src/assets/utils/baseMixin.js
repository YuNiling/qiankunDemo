export default {
  data() {
    return {
      msg: 'test'
    };
  },
  created() {
    console.log('***created*****');
  },
  methods: {
    hello() {
      console.log('hello from mixin!');
    }
  }
}