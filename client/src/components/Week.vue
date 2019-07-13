<template>
  <div class="calendar__row">
    <Day 
      v-for='(day, index) in week' 
      :key='index' 
      :day='day' 
      :modalNewEventHandler='modalNewEventHandler' 
      :modalEventHandler='modalEventHandler'
    />
  </div>
</template>

<script>
import Day from './Day';

  export default {
    name: 'Week',
    components: {
      Day
    },
    props: ['week', 'modalNewEventHandler', 'modalEventHandler'],
    created() {
      // console.log('here', this.eventForThisMonth());
    }
  }
</script>

<style>
  .calendar__row {
    display: flex;
    flex-direction: row;
  }
</style>