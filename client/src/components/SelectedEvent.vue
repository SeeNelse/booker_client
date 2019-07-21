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
      <h5 class='selected-event__head'>{{this.selectedEventsObj[0].day}}.{{this.selectedEventsObj[0].month + 1}}.{{this.selectedEventsObj[0].year}}</h5>
      <div v-for='event in selectedEventsObj' class="selected-event__item">
          <h5 class="selected-event__time">{{minToHours(event.time_start)}} - {{minToHours(event.time_end)}}</h5>
          <ul class="selected-event__list">
            <li>{{event.user_name}}</li>
            <li v-if='event.note'>{{event.note}}</li>
          </ul>
          <div 
            class="selected-event__btns"
            v-if='userInfo.role === 1 && canEditAndDelete(event) || 
            userInfo.userId === event.user_id && canEditAndDelete(event)'
          >
            <b-button @click='eventEdit(event)'><font-awesome-icon icon='edit'/></b-button>
            <b-button @click='deleteBtn(event.event_id, event)'><font-awesome-icon icon='trash-alt'/></b-button>
          </div>
      </div>
    </div>
  </fragment>
</template>

<script>
import to12hConvert from '@/helpers/to12hConvert';
import store from '@/Store';

export default {
  name: 'SelectedEvent',
  props: ['selectedEventsObj', 'selectedEventsRoom', 'timeTypeBool', 'deleteBtn', 'eventEdit', 'currentDate'],
  created() {
  },
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
    },
    canEditAndDelete(event) { // Скрыть удаление и редактирование записи, которая уже прошла
      let eventDate = this.currentDate.replace('-', '').replace('-', '');

      let date = new Date();
      var currentDay = date.getDate();
      var currentMonth = date.getMonth() + 1;
      var currentYear = date.getFullYear();
      let currentDate = currentYear + "0" + currentMonth + currentDay;

      if(eventDate < currentDate) {
        return false;
      } else {
        return true;
      }
    }
  },
  computed: {
    userInfo: {
      get () {
        return store.state.userInfo
      },
    },
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
  .selected-event_red button {
    background: #ea6c78;
    border: 1px solid #da4856;
  }
  .selected-event_red button:hover {
    background: #ea6c78;
    box-shadow: inset 0px 0px 77px -30px rgba(0,0,0,0.45) !important;
  }

  .selected-event_blue {
      border-top: 5px solid #4197f3;
  }
  .selected-event_blue button {
    background: #4197f3;
    border: 1px solid #2f6caf;
  }
  .selected-event_blue button:hover {
    background: #4197f3;
    box-shadow: inset 0px 0px 77px -30px rgba(0,0,0,0.45) !important;
  }

  .selected-event_green {
    border-top: 5px solid #4fc369;
  }
  .selected-event_green button {
    background: #4fc369;
    border: 1px solid #329448;
  }
  .selected-event_green button:hover {
    background: #4fc369;
    box-shadow: inset 0px 0px 77px -30px rgba(0,0,0,0.45) !important;
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
  .selected-event__btns button {
    margin-right: 10px;
  }
</style>