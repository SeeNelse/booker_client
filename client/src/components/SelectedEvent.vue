<template>
  <fragment>
      <b-list-group>
        <b-list-group-item>Name: {{selectedEventObj.user_name}}</b-list-group-item>
        <b-list-group-item>Time: {{selectedEventObj.time_start}} - {{selectedEventObj.time_end}}</b-list-group-item>
        <b-list-group-item>Date: {{selectedEventObj.day}}-{{+selectedEventObj.month+1 < 10 ? '0' + (+selectedEventObj.month+1) : +selectedEventObj.month+1}}-{{selectedEventObj.year}}</b-list-group-item>
        <b-list-group-item>Room: {{selectedEventObj.room_name}}</b-list-group-item>
        <b-list-group-item v-if='selectedEventObj.note'>Note: {{selectedEventObj.note}}</b-list-group-item>
      </b-list-group>

      <div class="selected-event__btns">
        <b-button @click="$bvModal.hide('selectedEvent')" variant="primary">Ok</b-button>
      </div>
  </fragment>
</template>

<script>
export default {
  name: 'SelectedEvent',
  props: ['selectedEventObj'],
  data() {
    return {

    }
  },
}
</script>

<style>
  .selected-event__btns {
    margin-top: 20px;
  }
</style>