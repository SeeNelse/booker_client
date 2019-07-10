<template>
  <td :class="{ 
    'calendar__grey': day.gray, 
    'calendar__current': day.presentDay, 
    'calendar__weekend' : day.weekend }"
  >
    {{ day.number }}
  </td>
</template>

<script>
  export default {
    name: 'Day',
    props: ['day']
  }
</script>

<style>

</style>