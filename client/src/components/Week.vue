<template>
  <tr>
    <Day v-for='(day, index) in week' :key='index' :day='day'></Day>
  </tr>
</template>

<script>
import Day from './Day';

  export default {
    name: 'Week',
    components: {
      Day
    },
    props: ['createCurrentMonth', 'week']
  }
</script>

<style>

</style>