import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    events: {
      // 'red' : {
      //   '2019-07-12': {
      //     '10:45-11:00' : {
      //       day: "2019-07-12",
      //       endTime: "10:45",
      //       startTime: "11:00",
      //     }
      //   }
      // }
    }
  },
  mutations: {
    increment (state) {
      state.count++
    }
  }
});

export default store;
