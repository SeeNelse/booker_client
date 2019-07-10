import Vue from 'vue';
import Vuex from 'vuex';
import Routes from './Routes';

import App from './App.vue';
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

Vue.use(BootstrapVue);
Vue.use(Vuex);

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router: Routes
}).$mount('#app')
