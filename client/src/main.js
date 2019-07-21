import Vue from 'vue';
// import Vuex from 'vuex';
import Routes from './Routes';

import App from './App.vue';

import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faChevronRight, faChevronLeft, faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Fragment from 'vue-fragment';
import { Timepicker } from 'buefy/dist/components/timepicker';
Vue.component('b-timepicker', Timepicker);
import { Switch } from 'buefy/dist/components/switch';
Vue.component('b-switch', Switch);
import '@/css/timePicker.css';


Vue.use(Fragment.Plugin);
Vue.use(BootstrapVue);
library.add(faChevronRight, faChevronLeft, faEdit, faTrashAlt);
Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
  router: Routes
}).$mount('#app');
