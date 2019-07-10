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
  display: inline-table;
  border: 1px solid #000 !important;
  text-align: center;
}
</style>