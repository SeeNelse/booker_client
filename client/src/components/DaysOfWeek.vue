<template>
  <th class="calendar__daysOfWeek">{{ item }}</th>
</template>

<script>
  export default {
    name: 'DaysOfWeek',
    props: ['item']
  }
</script>
  
<style>
.calendar__daysOfWeek {
  width: 14.285714%;
  text-align: center;
  font-weight: 400;
}
</style>