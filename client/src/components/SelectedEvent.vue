<template>
  <fragment v-if='this.selectedEventsObj.length'>
    <div class='selected-event'>
      <div v-for='event in selectedEventsObj'>
        {{event.day}}
      </div>
    </div>
  </fragment>
</template>

<script>
export default {
  name: 'SelectedEvent',
  props: ['selectedEventsObj'],
}
</script>

<style>
  .selected-event {
    border: 1px solid #d4d4d4;
    border-top: 5px solid #17a2b8;
    margin-top: 50px;
    padding: 12px 15px 20px;
    margin-bottom: 40px;
  }
  .selected-event__btns {
    margin-top: 20px;
  }
</style>