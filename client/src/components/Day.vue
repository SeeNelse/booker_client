<template>
  <div 
    class="calendar__day"
    :class="{ 
    'calendar__grey': day.gray, 
    'calendar__current': day.presentDay, 
    'calendar__weekend' : day.weekend }"
  >
    <div class="calendar__day-handler" v-on:click="modalNewEventHandler(day)"></div>
    <span class="calendar__day-nubmer">
      {{ day.number }}
    </span>
    <!-- {{ getEvents() }} -->
    <div v-if='getEvents().length' v-for='event in getEvents()'>
      <b-badge class="calendar__day-event" variant="dark" v-on:click="modalEventHandler(event)">{{event.time_start}} - {{event.time_end}}</b-badge>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Day',
    props: ['day', 'modalNewEventHandler', 'modalEventHandler'],
    data() {
      return {
        events: []
      }
    },
    methods: {
      getEvents() {
        if (!this.day.scanned && this.day.events.length) {
          this.day.events.forEach(element => {
            let startTime = new Date(element.time_start);
            let startFullTime = (startTime.getHours() < 10 ? '0' + startTime.getHours() : startTime.getHours()) 
              + ':' + (startTime.getMinutes() == 0 ? startTime.getMinutes() + '0' : startTime.getMinutes());
            element.time_start = startFullTime;

            let endTime = new Date(element.time_end);
            let endFullTime = (endTime.getHours() < 10 ? '0' + endTime.getHours() : endTime.getHours()) 
              + ':' + (endTime.getMinutes() == 0 ? endTime.getMinutes() + '0' : endTime.getMinutes());
            
            element.time_end = endFullTime;
          });
          this.day.scanned = true;
        }
        return this.day.events;
      }
    },
  }
</script>

<style>
  .calendar__day {
    width: 130px;
    height: 130px;
    position: relative;
    cursor: pointer;
    background: #17a2b8;
    margin: 0.5px;
    border: 0.5px solid #ffffff;
    transition: .3s;
    padding-left: 5px;
    padding-top: 5px;
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
  }
  .calendar__day-event:hover {
    background-color: #505050;
  }
  .calendar__day:hover {
    transform: scale(1.02);
  }
  .calendar__day-nubmer {
    position: absolute;
    top: 5px;
    right: 10px;
  }
  .calendar__weekend {
    background: #dc3545;
    cursor: not-allowed;
  }
  .calendar__grey {
    background: #bcbfc1;
    cursor: not-allowed;
  }
  .calendar__current {
    border: 4px solid red;
  }
  .calendar__weekend.calendar__current {
    border: 4px solid #888585;
  }
  .calendar__current .calendar__day-nubmer {
    right: 7px;
    top: 1px;
  }
</style>