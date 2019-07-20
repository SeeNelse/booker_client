<template>
  <fragment v-if='this.selectedEventsObj.length'>
    <div 
      class='selected-event'
      :class="{ 
        'selected-event_red': this.selectedEventsObj[0].room_name === 'red', 
        'selected-event_blue': this.selectedEventsObj[0].room_name === 'blue', 
        'selected-event_green' : this.selectedEventsObj[0].room_name === 'green' 
      }"
    >
      <h4 class='selected-event__head'>{{selectedEventsRoom}} room</h4>
      <div v-for='event in selectedEventsObj' class="selected-event__item">
          <h5 class="selected-event__time">{{minToHours(event.time_start)}} - {{minToHours(event.time_end)}}</h5>
          <ul class="selected-event__list">
            <li>{{event.user_name}}</li>
            <li>{{event.day}}.{{event.month}}.{{event.year}}</li>
            <li v-if='event.note'>{{event.note}}</li>
          </ul>
      </div>
    </div>
  </fragment>
</template>

<script>
import to12hConvert from '@/helpers/to12hConvert';

export default {
  name: 'SelectedEvent',
  props: ['selectedEventsObj', 'selectedEventsRoom', 'timeTypeBool'],
  methods: {
    minToHours(min) { // Перевод минут в человеческое время
      let hours = min / 60;
      let timeObj = String(hours).split('.');
      let resultTime = ((+timeObj[0] + 3) < 10 ? '0'+(+timeObj[0] + 3) : (+timeObj[0] + 3)) + ':' + ((+('0.'+timeObj[1]) * 60) || '00'); // Чтобы не писать 5 строк сделал такого франкенштейна. До ':' - часы, после - минуты
      if (this.timeTypeBool) {
        return to12hConvert(resultTime);
      } else {
        return resultTime;
      }
    }
  }
}
</script>

<style>
  .selected-event__head {
    text-align: center;
  }
  .selected-event__time {
    margin-bottom: 5px;
  }
  .selected-event {
    border: 1px solid #d4d4d4;
    border-top: 5px solid #17a2b8;
    margin-top: 50px;
    padding: 12px 15px 20px;
    margin-bottom: 40px;
  }
  .selected-event_red {
    border-top: 5px solid #ea6c78;
  }
  .selected-event_blue {
      border-top: 5px solid #4197f3;
  }
  .selected-event_green {
    border-top: 5px solid #4fc369;
  }
  .selected-event__btns {
    margin-top: 20px;
  }
  .selected-event__list {
    list-style: none;
    padding: 0;
    margin-bottom: 0;
  }
  .selected-event__item {
    padding-bottom: 20px;
    margin-bottom: 15px;
    border-bottom: 1px solid #d4d4d4;
  }
  .selected-event__item:last-child {
    border: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
</style>