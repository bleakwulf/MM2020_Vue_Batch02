import Vue from 'vue'
import App from './App.vue'
import Vuelidate from 'vuelidate';
import VueRouter from 'vue-router';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import store from './store';

import { routes } from './routes.js';

const router = new VueRouter({
  routes,
  mode: "history"
})


// Vue.config.productionTip = false

Vue.use(Vuelidate);
Vue.use(VueRouter);

new Vue({
  el: '#app',
  router, 
  store,
  render: h => h(App),
}).$mount('#app')
