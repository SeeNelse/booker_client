<template>
  <div class="calendar__row">
    <Day 
      v-for='(day, index) in week' 
      :key='index' 
      :day='day' 
      :modalNewEventHandler='modalNewEventHandler' 
      :windowEventHandler='windowEventHandler'
      :selectRoomsValue='selectRoomsValue'
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
    props: ['week', 'modalNewEventHandler', 'windowEventHandler', 'selectRoomsValue'],
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