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
  width: 130px;
  text-align: center;
}
</style>