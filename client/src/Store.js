import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    timeType: false,
    startDay: false,
    selectRoomsValue: 'all',
  },
  getters: {
    startDay () {
      return store.state.startDay;
    },
  },
  mutations: {
    SET_DAY (state, payload) {
      state.startDay = payload;
    },
    SET_ROOM (state, payload) {
      state.selectRoomsValue = payload;
    }
  }
});

export default store;
