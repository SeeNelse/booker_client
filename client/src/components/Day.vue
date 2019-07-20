<template>
  <div 
    class="calendar__day"
    :class="{ 
      'calendar__grey': day.gray, 
      'calendar__current': day.presentDay, 
      'calendar__weekend' : day.weekend 
    }"
  >
    <div class="calendar__day-handler" v-on:click="modalNewEventHandler(day)"></div>
    <span class="calendar__day-nubmer">
      {{ day.number }}
    </span>
    
    <div v-if='getEvents'>
      <div 
        v-for='(event, roomName) in getEvents' 
        v-if="
        selectRoomsValue === 1 && roomName === 'red' ||
        selectRoomsValue === 2 && roomName === 'blue' ||
        selectRoomsValue === 3 && roomName === 'green' ||
        selectRoomsValue === 'all'"
      >
        <b-badge 
          class="calendar__day-event" 
          :class="{
            'calendar__day-event-red': roomName === 'red',
            'calendar__day-event-blue': roomName === 'blue',
            'calendar__day-event-green': roomName === 'green'
          }"
          variant="dark" 
          v-on:click="windowEventHandler(event)"
        >{{event.length}} events</b-badge>
      </div>
    </div>
    
  </div>
</template>

<script>
import vueCustomScrollbar from 'vue-custom-scrollbar'
export default {
  name: 'Day',
  components: {
  },
  props: ['day', 'modalNewEventHandler', 'windowEventHandler', 'selectRoomsValue'],
  data() {
    return {

    }
  },
  computed: {
    getEvents() {
      let dayEvents = {};
      if (!this.day.scanned && this.day.events.length) {
        this.day.events.forEach(element => {
          if (!dayEvents[element.room_name]) {
            dayEvents[element.room_name] = [];
          }
          dayEvents[element.room_name].push(element);
        });
        this.day.scanned = true;
        return dayEvents;
      }
    }
  },
  methods: {

  },
}
</script>

<style>
  .calendar__row {
    width: 100%;
  }
  .calendar__day {
    width: 14.285714%;
    height: 130px;
    position: relative;
    cursor: pointer;
    transition: .3s;
    padding-left: 5px;
    padding-top: 5px;
    border-right: 1px solid #d4d4d4;
    border-bottom: 1px solid #d4d4d4;
  }
  .calendar__day:first-child {
    border-left: 1px solid #d4d4d4;
  }
  .calendar__row:first-child {
    border-top: 1px solid #d4d4d4;
  }
  .calendar__day:hover {
    background: #afe2ea;
  }
  .calendar__day-handler {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 0;
  }
  .calendar__day-event {
    z-index: 2;
    position: relative;
    line-height: 18px !important;
    margin-bottom: 5px;
    height: 25px;
    display: inline-block !important;
  }
  .calendar__day-event-red {
    background-color: #ea6c78 !important;
  }
  .calendar__day-event-blue {
    background-color: #4197f3 !important;
  }
  .calendar__day-event-green {
    background-color: #4fc369 !important;
  }
  .calendar__day-event:hover {
    box-shadow: inset 0px 0px 77px -30px rgba(0,0,0,0.45);
  }
  .calendar__day-nubmer {
    position: absolute;
    top: 5px;
    right: 10px;
  }
  .calendar__weekend {
    background: #e6f8fb;
    cursor: not-allowed;
  }
  .calendar__weekend:hover {
    background: #e6f8fb;
  }
  .calendar__grey {
    cursor: not-allowed;
    color: #d4d4d4;
  }
  .calendar__grey:hover {
    background: #ffffff;
  }
  .calendar__current::after {
    border: 2px solid #17a2b8;
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    pointer-events: none;
  }
  .calendar__current .calendar__day-nubmer {
    right: 7px;
    top: 1px;
  }
  .scroll-area {
    position: relative;
    margin: auto;
    height: 400px; 
  }
</style>