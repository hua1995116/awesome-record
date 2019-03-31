import Vue from 'vue'
import App from './App.vue'
import vueRecord from '../src/index'


Vue.use(vueRecord);

new Vue({
  el: '#app',
  render: h => h(App)
});
