import Vue from 'vue';
import App from './App.vue';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Vuelidate from 'vuelidate';
import VueResource from 'vue-resource';
import VueRouter from 'vue-router';

import { routes } from './routes.js';

const router = new VueRouter({
  routes,
  mode: "history"
})

export const eventBus = new Vue();

Vue.use(Vuelidate);
Vue.use(VueResource);
Vue.use(VueRouter);

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
