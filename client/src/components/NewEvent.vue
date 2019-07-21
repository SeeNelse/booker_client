<template>
  <fragment>
    <b-form @submit="newEventSubmit">
      <b-form-group
        id="newEvent-group-1"
        label="Select room:*"
        label-for="newEvent-select-room"
      >
        <b-form-select v-model="newEventForm.room" :options="roomstList" class='sidebar__select'></b-form-select>
      </b-form-group>

      <b-alert show variant="danger" v-if='errors.room'>Select room please</b-alert>

      <b-form-group
        id="newEvent-group-2"
        label="Select day:*"
        label-for="newEvent-day"
      >
        <b-form-input
          id="newEvent-day"
          v-model="newEventForm.date"
          type="date"
          :min='minDateValue()'
          required
          placeholder="Select day"
        ></b-form-input>
      </b-form-group>
      <b-alert show variant="danger" v-if='errors.date'>Enter date please</b-alert>

      <b-row>
        <b-col cols='4'>
          <b-form-group 
            id="newEvent-group-3" 
            label="Select start time:*" 
            label-for="newEvent-start-time"
          >
            <b-timepicker
              rounded
              
              placeholder="Click to select..."
              icon="clock"
              :min-time="new Date('Fri Jul 12 2019 08:00:00')"
              :max-time="new Date('Fri Jul 12 2019 19:45:00')"
              :increment-minutes='15'
              :hour-format="timeType"
              v-model="newEventForm.startTime"
            />
          </b-form-group>
          <b-alert show variant="danger" v-if='errors.startTime'>Min time 8:00, max 19:45</b-alert>
        </b-col>

        <b-col cols='4'>
          <b-form-group 
            id="newEvent-group-4" 
            label="Select end time:*" 
            label-for="newEvent-End-time"
          >
            <b-timepicker
              rounded
              v-model="newEventForm.endTime"
              placeholder="Click to select..."
              icon="clock"
              :min-time="new Date('Fri Jul 12 2019 08:15:00')"
              :max-time="new Date('Fri Jul 12 2019 20:00:00')"
              :increment-minutes='15'
              :hour-format="timeType"
            />
          </b-form-group>
          <b-alert show variant="danger" v-if='errors.endTime'>Min time 8:15, max 20:00</b-alert>
        </b-col>
        <b-col cols='4' class="calendar__timeFormat">
          <div class="control">
            <b-switch v-model="timeTypeBool">AM/PM</b-switch>
          </div>
        </b-col>
      </b-row>
      
      <b-alert show variant="danger" v-if='errors.time'>Incorrect value</b-alert>
      <b-alert show variant="danger" v-if='errors.time15min'>Minimum difference is 15 minutes</b-alert>

      <b-form-group 
        id="newEvent-group-5" 
        label="Note:" 
        label-for="newEvent-note"
      >
        <b-form-textarea
          id="newEvent-note"
          v-model="newEventForm.note"
          placeholder="Enter notes..."
          rows="4"
          max-rows="6"
        ></b-form-textarea>
      </b-form-group>

      <b-alert show variant="danger" v-if='errors.note'>250 characters maximum</b-alert>
      
      <b-form-group label="Is recurrent?">
        <b-form-radio-group label="Is recurrent?" v-model="newEventForm.recurrent.status">
          <b-form-radio name="recurrent-radio" :value="false">No</b-form-radio>
          <b-form-radio name="recurrent-radio" :value="true">Yes</b-form-radio>
        </b-form-radio-group>
      </b-form-group>

      <div v-if='newEventForm.recurrent.status'>
        <b-form-group>
          <b-form-radio name="recurrent-apply-radio" v-model="newEventForm.recurrent.type" value="Weekly">Weekly</b-form-radio>
          <b-form-input
            v-if='newEventForm.recurrent.type === "Weekly"'
            v-model="newEventForm.recurrent.countWeekly"
            type="number"
            required
            min='1'
            max='4'
          ></b-form-input>
        </b-form-group>
        <b-form-group>
          <b-form-radio name="recurrent-apply-radio" v-model="newEventForm.recurrent.type" value="Biweekly">Biweekly</b-form-radio>
          <b-form-input
            v-if='newEventForm.recurrent.type === "Biweekly"'
            v-model="newEventForm.recurrent.countBiweekly"
            type="number"
            required
            min='1'
            max='2'
          ></b-form-input>
        </b-form-group>
        <b-form-group>
          <b-form-radio name="recurrent-apply-radio" v-model="newEventForm.recurrent.type" value="Monthly">Monthly</b-form-radio>
        </b-form-group>
        <b-alert show variant="danger" v-if='errors.reccurent'>Incorrect value</b-alert>
      </div>

      <b-button type="submit" variant="info">Submit</b-button>
      <b-alert show variant="success" class='calendar__success' v-if='eventSuccess'>You have successfully registered an event</b-alert>
      <b-alert show variant="danger" class='calendar__success' v-if='errors.timeTaken'>This time is already taken</b-alert>
    </b-form>
  </fragment>
</template>


<script>
import store from '@/Store';
import axios from 'axios';
import serverUrl from '@/config';


export default {
  name: 'NewEvent',
  props: ['currentDate', 'dayOnClick', 'getEventsForThisMonth', 'roomList'],
  data() {
    return {
      formatAmPm: '',
      newEventForm: {
        room: null,
        date: '',
        startTime: this.startEndTimeDate(true),
        endTime: this.startEndTimeDate(false),
        note: '',
        recurrent: {
          status: false,
          type: '',
          countWeekly: '1',
          countBiweekly: '1',
          countMonthly: '1',
        },
      },
      errors: {
        startTime: false,
        endTime: false,
        room: false,
        date: false,
        reccurent: false,
        time: false,
        time15min: false,
        note: false,
        timeTaken: false,
      },
      eventSuccess: false
    }
  },
  created() {
    this.newEventForm.date = this.currentDate;
  },
  methods: {

    newEventSubmit(event) {
      event.preventDefault();
      // Проверки
      if (!this.newEventForm.room) {
        this.errors.room = true;
        return false;
      } else {
        this.errors.room = false;
      }

      if (!this.newEventForm.date) {
        this.errors.date = true;
        return false;
      } else {
        this.errors.date = false;
      }

      if (this.newEventForm.startTime >= this.newEventForm.endTime) {
        this.errors.time = true;
        return false;
      } else {
        this.errors.time = false;
      }

      if (
        this.newEventForm.recurrent.type === 'Weekly' && this.newEventForm.recurrent.countWeekly < 1 || 
        this.newEventForm.recurrent.type === 'Weekly' && this.newEventForm.recurrent.countWeekly > 4
      ) {
        this.errors.reccurent = true;
        return false;
      } else {
        this.errors.reccurent = false;
      }

      if (
        this.newEventForm.recurrent.type === 'Biweekly' && this.newEventForm.recurrent.countBiweekly < 1 || 
        this.newEventForm.recurrent.type === 'Biweekly' && this.newEventForm.recurrent.countBiweekly > 2
      ) {
        this.errors.reccurent = true;
        return false;
      } else {
        this.errors.reccurent = false;
      }

      if (this.newEventForm.recurrent.type === 'Monthly' && this.newEventForm.recurrent.countMonthly != 1) {
        this.errors.reccurent = true;
        return false;
      } else {
        this.errors.reccurent = false;
      }

      if (this.newEventForm.note.length > 250) {
        this.errors.note = true;
        return false;
      } else {
        this.errors.note = false;
      }

      if (!this.newEventForm.recurrent.status) {
        this.newEventForm.recurrent.type = '';
      }
      // форматируем часы в минуты
      let startTime = new Date(this.newEventForm.startTime);
      startTime = startTime.getTime() / 60000;
      let endTime = new Date(this.newEventForm.endTime);
      endTime = endTime.getTime() / 60000;
      let eventDataResult = {
        ...this.newEventForm, 
        startTime: Math.floor(startTime), 
        endTime: Math.floor(endTime), 
        userId: this.userInfo.userId
      };

      // отправляем запрос
      const eventDataForDB = JSON.stringify(eventDataResult);
      axios.post(`${serverUrl}/api/event/new`, eventDataForDB)
        .then((response) => {
          if (response.status === 200) {
            this.eventSuccess = true;
            this.errors.timeTaken = false;
            this.getEventsForThisMonth();
            setTimeout(function() {
              this.eventSuccess = false;
              this.$bvModal.hide('newEvent');
            }.bind(this), 1000);
          }
        })
        .catch((error) => {
          this.errors.timeTaken = true;
        });

    },

    // минимальная дата(текущая) при выборе дня события
    minDateValue() {
      var dateObj = new Date();
      var day = dateObj.getDate();
      var month = dateObj.getMonth() + 1;
      var year = dateObj.getFullYear();
      if (day < 10) {
        day = '0'+day;
      }
      if (month < 10) {
        month = '0'+month;
      }
      return year+"-"+month+"-"+day;
    },

    startEndTimeDate(start) {
      if (this.dayOnClick.presentDay) {
        let date = new Date();
        date = date.toJSON();
        let time = date.match( /T\d\d:\d\d/i );
        time = time[0].split('T');

        let partTime = time[1].split(':');
        if (start) {
          var hours = +partTime[0];
        } else {
          var hours = +partTime[0] + 1;
        }
        let minute = partTime[1];

        if (minute < 15) {
          minute = '15';
        } else if (minute > 15 && minute < 30) {
          minute = '30';
        } else if (minute > 30 && minute < 45) {
          minute = '45';
        } else if (minute > 45) {
          hours++;
          minute = '00';
        }

        if (+hours < 10) {
          hours = '0' + hours;
        }

        date = date.replace(time[1], hours+':'+minute);
        date = new Date(date);
        date.setDate(1);
        date.setFullYear(1970);
        date.setMonth(0);
        date.setSeconds(0);
        return new Date(date);
      } else {
        if (start) {
          return new Date('Jan 01 1970 08:00:00');
        } else {
          return new Date('Jan 01 1970 09:00:00');
        }
      }
    }

  },
  computed: {
    format() {
      return this.formatAmPm ? '12' : '24'
    },
    roomstList() {
      let rooms = [{ value: null, text: 'Please select', disabled: true }];
      this.roomList.forEach(element => {
        let roomName = element.room_name;
        roomName = roomName.charAt(0).toUpperCase() + roomName.substr(1);
        rooms.push({ value: element.room_id, text: roomName });
      });
      return rooms;
    },
    timeType: {
      get () {  
        return store.state.timeType
      },
      set (value) {
        store.commit('SET_TIME_24_12', value)
      }
    },
    timeTypeBool: {
      get () {  
        return store.state.timeTypeBool
      },
      set (value) {
        store.commit('SET_TIME', value)
      }
    },
    userInfo: {
      get () {
        return store.state.userInfo
      },
    },
  }
}
</script>

<style>
  .calendar__timeFormat {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding-top: 25px;
  }
  .calendar__success {
    margin-top: 10px;
  }
</style>
