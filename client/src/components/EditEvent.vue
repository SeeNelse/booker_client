<template>
  <fragment>
    <b-form @submit="editEventSubmit">
      <b-form-group
        id="editEvent-group-1"
        label="Created by:*"
        label-for="editEvent-select-room"
      >
        <b-form-select v-model="editEventForm.userId" :options="userList" class='sidebar__select'></b-form-select>
      </b-form-group>
      <b-row>
        <b-col cols='4'>
          <b-form-group 
            id="editEvent-group-3" 
            label="Select start time:*" 
            label-for="editEvent-start-time"
          >
            <b-timepicker
              rounded
              
              placeholder="Click to select..."
              icon="clock"
              :min-time="new Date('Fri Jul 12 2019 08:00:00')"
              :max-time="new Date('Fri Jul 12 2019 19:45:00')"
              :increment-minutes='15'
              :hour-format="timeType"
              v-model="editEventForm.startTime"
            />
          </b-form-group>
          <b-alert show variant="danger" v-if='errors.startTime'>Min time 8:00, max 19:45</b-alert>
        </b-col>

        <b-col cols='4'>
          <b-form-group 
            id="editEvent-group-4" 
            label="Select end time:*" 
            label-for="editEvent-End-time"
          >
            <b-timepicker
              rounded
              v-model="editEventForm.endTime"
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
        id="editEvent-group-5" 
        label="Note:" 
        label-for="editEvent-note"
      >
        <b-form-textarea
          id="editEvent-note"
          v-model="editEventForm.note"
          placeholder="Enter notes..."
          rows="4"
          max-rows="6"
        ></b-form-textarea>
      </b-form-group>

      <b-alert show variant="danger" v-if='errors.note'>250 characters maximum</b-alert>
      
      <b-form-group label="Update recurrent?" v-if='currentEventForEdit.recurrent_type'>
        <b-form-radio-group label="Is recurrent?" v-model="editEventForm.updateRecurrent">
          <b-form-radio name="recurrent-radio" :value="false">No</b-form-radio>
          <b-form-radio name="recurrent-radio" :value="true">Yes</b-form-radio>
        </b-form-radio-group>
      </b-form-group>

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
  name: 'EditEvent',
  props: ['roomList', 'currentEventForEdit', 'getEventsForThisMonth'],
  data() {
    return {
      formatAmPm: '',
      editEventForm: {},
      errors: {
        startTime: false,
        endTime: false,
        time: false,
        time15min: false,
        note: false,
        timeTaken: false,
      },
      userList: [],
      eventSuccess: false
    }
  },
  created() {
    this.editEventForm = {
      startTime: this.startEndTimeDate(this.minToHours(this.currentEventForEdit.time_start)),
      endTime: this.startEndTimeDate(this.minToHours(this.currentEventForEdit.time_end)),
      note: this.currentEventForEdit.note,
      updateRecurrent: false,
      userId: this.currentEventForEdit.user_id,
      userRole: store.state.userInfo.role
    };

    axios.get(`${serverUrl}/api/user/list`)
      .then(response => {
        let users = [];
        response.data.forEach(element => {
          users.push({ value: element.user_id, text: element.user_name });
        });
        this.userList = users;
      });
  },
  methods: {
    editEventSubmit(event) {
      event.preventDefault();
      // Проверки
      if (this.editEventForm.startTime >= this.editEventForm.endTime) {
        this.errors.time = true;
        return false;
      } else {
        this.errors.time = false;
      }

      if (this.editEventForm.note.length > 250) {
        this.errors.note = true;
        return false;
      } else {
        this.errors.note = false;
      }

      let startTime = new Date(this.editEventForm.startTime);
      startTime = startTime.getTime() / 60000;
      let endTime = new Date(this.editEventForm.endTime);
      endTime = endTime.getTime() / 60000;
      let eventDataResult = {
        ...this.editEventForm, 
        startTime: Math.floor(startTime), 
        endTime: Math.floor(endTime), 
      };

      const eventDataForDB = JSON.stringify(eventDataResult);
      axios.put(`${serverUrl}/api/event/edit/${this.currentEventForEdit.event_id}`, eventDataForDB)
        .then((response) => {
          this.errors.timeTaken = false;
          this.eventSuccess = true;
          this.getEventsForThisMonth();
          setTimeout(function() {
              this.eventSuccess = false;
              this.$bvModal.hide('editEvent');
            }.bind(this), 1000);
        })
        .catch((error) => {
          this.errors.timeTaken = true;
        });
    },
    createCurrentDate() {
      // Дата для поля
      let day = this.currentEventForEdit.day;
      let month = this.currentEventForEdit.month + 1;
      let year = this.currentEventForEdit.year;
      if (day < 10) {
        day = '0'+day;
      }
      if (month < 10) {
        month = '0'+month;
      }

      return year+'-'+month+'-'+day;
    },
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
    startEndTimeDate(time) {
      let partTime = time.split(':');
      let hours = +partTime[0]; 
      let minute = partTime[1];
      let date = new Date();
      date.setDate(1);
      date.setFullYear(1970);
      date.setMonth(0);
      date.setSeconds(0);
      date.setMinutes(minute);
      date.setHours(hours);
      return new Date(date);
    },
  },
  computed: {
    format() {
      return this.formatAmPm ? '12' : '24'
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

</style>
