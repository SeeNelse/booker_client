import Vue from 'vue';
import VueRouter from 'vue-router';
import Month from '@/containers/Month';

Vue.use(VueRouter);

export default new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Month',
      component: Month
    },
  ]
});