<template>
  <div 
    class="calendar__day"
    :class="{ 
    'calendar__grey': day.gray, 
    'calendar__current': day.presentDay, 
    'calendar__weekend' : day.weekend }"
    v-on:click="modalEventHandler(day)"
  >
    <span class="calendar__day-nubmer">
      {{ day.number }}
    </span>
  </div>
</template>

<script>
  export default {
    name: 'Day',
    props: ['day', 'modalEventHandler'],
    methods: {
      // modalEventHandler(day) {
      //   if (!day.gray && !day.weekend) {
      //     this.$bvModal.show('newEvent');
      //   }
      // }
    }
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
  .calendar__current .calendar__day-nubmer {
    right: 7px;
    top: 1px;
  }
</style>