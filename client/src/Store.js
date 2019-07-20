import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    timeTypeBool: false,
    startDay: false,
    selectRoomsValue: 'all',
    timeType: '24',
    userInfo: {}
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
    },
    SET_TIME (state, payload) {
      state.timeTypeBool = payload;
      if (payload) {
        state.timeType = '12';
      } else {
        state.timeType = '24';
      }
    },
    SET_TIME_24_12 (state, payload) {
      state.timeType = payload;
    },
    SET_USER_INFO (state, payload) {
      state.userInfo = payload;
    }
  }
});

export default store;
