import Vue from 'vue';
import VueRouter from 'vue-router';
import Month from '@/containers/Month';
import AdminPanel from '@/containers/AdminPanel';

Vue.use(VueRouter);

export default new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Month',
      component: Month
    },
    {
      path: '/admin-panel',
      name: 'AdminPanel',
      component: AdminPanel
    },
  ]
});