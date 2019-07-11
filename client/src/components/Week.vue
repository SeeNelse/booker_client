<template>
  <div class="calendar__row">
    <Day v-for='(day, index) in week' :key='index' :day='day' :modalEventHandler='modalEventHandler'></Day>
  </div>
</template>

<script>
import Day from './Day';

  export default {
    name: 'Week',
    components: {
      Day
    },
    props: ['createCurrentMonth', 'week', 'modalEventHandler']
  }
</script>

<style>
  .calendar__row {
    display: flex;
    flex-direction: row;
  }
</style>