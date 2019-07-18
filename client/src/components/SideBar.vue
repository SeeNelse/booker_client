<template>
  <div class="sidebar">
    <h4 class="sidebar__head">Controls</h4>
    <div class="sidebar-control">
      <div class="sidebar-control__item">
        24h <b-form-checkbox v-model="timeType" name="check-button" switch /> 12h
      </div>
      <div class="sidebar-control__item">
        Mo <b-form-checkbox v-model="startDay" name="check-button" switch /> Su
      </div>
    </div>
    <div>
      <h4 class="sidebar__head">Select room</h4>
      <b-form-select v-model="selectRoomsValue" :options="roomstList" class='sidebar__select'></b-form-select>
    </div>
  </div>
</template>

<script>
import store from '@/Store';

export default {
  name: 'SideBar',
  props: ['roomList'],
  data() {
    return {
      timeType: store.state.timeType,
    }
  },
  computed: {
    roomstList() {
      let rooms = [{ value: 'all', text: 'All room' }];
      this.roomList.forEach(element => {
        let roomName = element.room_name;
        roomName = roomName.charAt(0).toUpperCase() + roomName.substr(1);
        rooms.push({ value: element.room_id, text: roomName });
      });
      return rooms;
    },
    selectRoomsValue: {
      get () {
        return store.state.selectRoomsValue
      },
      set (value) {
        store.commit('SET_ROOM', value)
      }
    },
    startDay: {
      get () {
        return store.state.startDay
      },
      set (value) {
        store.commit('SET_DAY', value)
      }
    },
  }
}
</script>

<style>
  .sidebar {
    border: 1px solid #d4d4d4;
    border-top: 5px solid #17a2b8;
    margin-top: 78px;
    padding: 12px 15px 20px;
  }
  .sidebar__head {
    text-align: center;
  }
  .sidebar-control {
    display: flex;
    flex-direction: row;
    margin-bottom: 15px;
    border-bottom: 1px solid #d4d4d4;
    padding-bottom: 20px;
  }
  .sidebar-control .custom-switch {
    margin-left: 7px;
  }
  .sidebar-control__item {
    display: flex;
    flex-direction: row;
    width: 50%;
    justify-content: center;
  }
</style>