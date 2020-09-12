import Vue from 'vue';
import App from './App.vue';
import 'bootstrap';
// import 'bootstrap/dist/js/bootstrap.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import Vuelidate from 'vuelidate';

export const eventBus = new Vue();

Vue.use(Vuelidate)

new Vue({
  el: '#app',
  render: h => h(App)
})
