<template>
  <fragment>
    <b-form @submit="newEventSubmit">
      <b-form-group
        id="newEvent-group-1"
        label="Select room:*"
        label-for="newEvent-select-room"
      >
        <b-form-select id="newEvent-select-room" v-model="newEventForm.room" required>
          <option :value='null'>Please select</option>
          <option value="red">Room Red</option>
          <option value="blue">Room Bue</option>
          <option value="green">Room Green</option>
        </b-form-select>
      </b-form-group>

      <b-alert show variant="danger" v-if='errors.room'>Select room please</b-alert>

      <b-form-group
        id="newEvent-group-2"
        label="Select day:*"
        label-for="newEvent-day"
      >
        <b-form-input
          id="newEvent-day"
          v-model="newEventForm.day"
          type="date"
          :min='minDateValue()'
          required
          placeholder="Select day"
        ></b-form-input>
      </b-form-group>
      <b-alert show variant="danger" v-if='errors.day'>Enter date please</b-alert>

      <b-row>
        <b-col cols='6'>
          <b-form-group 
            id="newEvent-group-3" 
            label="Select start time:*" 
            label-for="newEvent-start-time"
          >
            <b-form-input
              id="newEvent-start-time"
              v-model="newEventForm.startTime"
              required
              type='time'
              min="08:00" 
              max="19:45"
              placeholder="Select start time"
            ></b-form-input>
          </b-form-group>
          <b-alert show variant="danger" v-if='errors.startTime'>Min time 8:00, max 19:45</b-alert>
        </b-col>

        <b-col cols='6'>
          <b-form-group 
            id="newEvent-group-4" 
            label="Select end time:*" 
            label-for="newEvent-End-time"
          >
            <b-form-input
              id="newEvent-end-time"
              v-model="newEventForm.endTime"
              required
              type='time'
              min="08:15" 
              max="20:00"
              placeholder="Select start time"
            ></b-form-input>
          </b-form-group>
          <b-alert show variant="danger" v-if='errors.endTime'>Min time 8:15, max 20:00</b-alert>
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
          <b-form-input
            v-if='newEventForm.recurrent.type === "Monthly"'
            v-model="newEventForm.recurrent.countMonthly"
            type="number"
            required
            min='1'
            max='1'
          ></b-form-input>
        </b-form-group>
        <b-alert show variant="danger" v-if='errors.reccurent'>Incorrect value</b-alert>
      </div>

      <b-button type="submit" variant="primary">Submit</b-button>
    </b-form>
  </fragment>
</template>


<script>
import store from '@/Store';

export default {
  name: 'NewEvent',
  props: ['currentDate', 'dayOnClick'],
  data() {
    return {
      newEventForm: {
        room: 'red',
        day: '',
        startTime: '08:45',
        endTime: '09:00',
        note: '',
        recurrent: {
          status: false,
          type: '',
          countWeekly: 1,
          countBiweekly: 1,
          countMonthly: 1,
        },
      },
      errors: {
        startTime: false,
        endTime: false,
        room: false,
        day: false,
        reccurent: false,
        time: false,
        time15min: false,
      },
    }
  },
  created() {
    this.newEventForm.day = this.currentDate;
  },
  methods: {
    newEventSubmit(event) {
      event.preventDefault();

      // // Проверки

      // Проверка на разницу 15 минут
      let startTime = this.newEventForm.startTime.split(':');
      let endTime = this.newEventForm.endTime.split(':');
      let startTimeMin = (+startTime[0] * 60) + +startTime[1];
      let endTimeMin = (+endTime[0] * 60) + +endTime[1];
      if (!((startTimeMin - endTimeMin) <= -15)) {
        this.errors.time15min = true;
        return false;
      } else {
        this.errors.time15min = false;
      }

      if (!this.newEventForm.room) {
        this.errors.room = true;
        return false;
      } else {
        this.errors.room = false;
      }

      if (!this.newEventForm.day) {
        this.errors.day = true;
        return false;
      } else {
        this.errors.day = false;
      }

      if (this.newEventForm.startTime >= this.newEventForm.endTime) {
        this.errors.time = true;
        return false;
      } else {
        this.errors.time = false;
      }

      if (this.newEventForm.startTime < '08:00' || this.newEventForm.startTime > '19:45') {
        this.errors.startTime = true;
        return false;
      } else {
        this.errors.startTime = false;
      }
      
      if (this.newEventForm.endTime < '08:15' || this.newEventForm.endTime > '20:00') {
        this.errors.endTime = true;
        return false;
      } else {
        this.errors.endTime = false;
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

      if (
        this.newEventForm.recurrent.type === 'Monthly' && this.newEventForm.recurrent.countMonthly != 1) {
        this.errors.reccurent = true;
        return false;
      } else {
        this.errors.reccurent = false;
      }

      
      // ЗАПИСЬ В БАЗУ
      // console.log(store.state.events); 
      // let codeDate = this.newEventForm.startTime+'-'+this.newEventForm.endTime;
      // console.log(codeDate);
      // store.state.events[this.newEventForm.day] = {...store.state.events[this.newEventForm.day], [codeDate]: this.newEventForm};

      // console.log(store.state.events);

      // store.state.events[this.newEventForm.day] = [this.newEventForm.startTime+'-'+this.newEventForm.endTime];
      // store.state.events[this.newEventForm.startTime+'-'+this.newEventForm.endTime] = this.newEventForm;

      console.log(store.state.events);
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
  }
}
</script>

<style>
  .calendar__time input {
    display: block;
    width: 100%;
    height: calc(1.5em + 0.75rem + 2px);
    padding: 0.375rem 0.75rem;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    color: #495057;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid #ced4da;
    border-radius: 0.25rem;
    -webkit-transition: border-color 0.15s ease-in-out, -webkit-box-shadow 0.15s ease-in-out;
    transition: border-color 0.15s ease-in-out, -webkit-box-shadow 0.15s ease-in-out;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out, -webkit-box-shadow 0.15s ease-in-out;
  }
</style>
