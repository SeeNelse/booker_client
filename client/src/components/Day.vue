<template>
  <fragment>
    <td :class="{ 
        'calendar__grey': day.gray, 
        'calendar__current': day.presentDay, 
        'calendar__weekend' : day.weekend }"
        class="calendar__day"
        :click="modalEventHandler"
    >
      <span class="calendar__day-nubmer">
        {{ day.number }}
      </span>
    </td>

    <b-modal id="newEvent" title="Modal with Popover" ok-only>
      <p>
        This
        <b-button v-b-popover="'Popover inside a modal!'" title="Popover">Button</b-button>
        triggers a popover on click.
      </p>
      <p>
        This <a href="#" v-b-tooltip title="Tooltip in a modal!">Link</a> will show a tooltip on
        hover.
      </p>
    </b-modal>
  </fragment>
  

</template>

<script>
  export default {
    name: 'Day',
    props: ['day'],
    methods: {
      modalEventHandler() {
        console.log(1)
        // this.$bvModal.show('newEvent');
      }
    }
  }
</script>

<style>
  .calendar__day {
    width: 130px;
    height: 130px;
    display: inline-table;
    position: relative;
    cursor: pointer;
    background: #B8EAB6;
  }
  .calendar__day-nubmer {
    position: absolute;
    top: 5px;
    right: 10px;
  }
  .calendar__weekend {
    background: rgba(239, 85, 85, 0.65);
    cursor: not-allowed;
  }
  .calendar__grey {
    background: #ccc;
    cursor: not-allowed;
  }
  .calendar__current {
    border: 4px solid red;
  }
</style>