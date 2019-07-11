<template>
  <fragment>
    <div class="calendar">
      <div class="calendar__controller">
        <b-button class="calendar__prev calendar__btn" variant="outline-info" @click="slideMonth(false)"><font-awesome-icon icon='chevron-left'/></b-button>
        <span class="calendar__mouth">{{currentMonthName()}} {{ getYear }}</span>
        <b-button class="calendar__next calendar__btn" variant="outline-info" @click="slideMonth(true)"><font-awesome-icon icon='chevron-right'/></b-button>
      </div>
      <div class="calendar__top">
        <DaysOfWeek v-for='(item, index) in daysName' :item='item' :key='index'></DaysOfWeek>
      </div>
      <div class="calendar__body">
        <Week :create-current-month='getCurrentMonthDays' v-for='(week, index) in getCurrentMonthDays' :key='index' :week='week' :modalEventHandler='modalEventHandler'></Week>
      </div>
    </div>

    <b-modal id="newEvent" title="Book room" hide-footer>
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
              label="Select start time:*" 
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
          <b-form-radio  name="recurrent-radio" value="A">No</b-form-radio>
          <b-form-radio  name="recurrent-radio" value="B">Yes</b-form-radio>
        </b-form-group>


        <b-button type="submit" variant="primary">Submit</b-button>
      </b-form>
    </b-modal>
  </fragment>
</template>

<script>
import Week from '@/components/Week';
import DaysOfWeek from '@/components/DaysOfWeek';
import VueTimepicker from 'vuejs-timepicker';

export default {
  name: 'Month',
  components: {
    Week, 
    DaysOfWeek
  },
  data() {
    return {
      getMonth: this.getCurrentMonthNumber(),
      getYear: this.getCurrentYear(),
      daysName: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
      monthsName: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      newEventForm: {
        room: 'red',
        day: '',
        startTime: '08:00',
        endTime: '09:00',
        note: '',
        recurrent: false,
        type: '',
      },
      errors: {
        startTime: false,
        endTime: false,
        room: false,
        day: false,
      },
      dayOnClick: {},
    }
  },
  methods: {

    modalEventHandler(day) {
      this.dayOnClick = day;
      let eventDate = this.currentDate().replace('-', '').replace('-', '');

      let date = new Date();
      var currentDay = date.getDate();
      var currentMonth = date.getMonth() + 1;
      var currentYear = date.getFullYear();
      let currentDate = currentYear + "0" + currentMonth + currentDay;

      if(eventDate < currentDate) {
        return false;
      }

      if (!day.gray && !day.weekend) {
        this.$bvModal.show('newEvent');
        this.newEventForm.day = this.currentDate();
      }
    },

    newEventSubmit(event) {
      event.preventDefault();
      if (this.newEventForm.startTime < '08:00' || this.newEventForm.startTime > '19:45') {
        this.errors.startTime = true;
      } else {
        this.errors.startTime = false;
      }
      if (this.newEventForm.endTime < '08:15' || this.newEventForm.endTime > '20:00') {
        this.errors.endTime = true;
      } else {
        this.errors.endTime = false;
      }
      if(!this.newEventForm.room) {
        this.errors.room = true;
      } else {
        this.errors.room = false;
      }
      if(!this.newEventForm.day) {
        this.errors.day = true;
      } else {
        this.errors.day = false;
      }
      console.log('submit')
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

    // данный день по клику на него(для автозаполнения инпута дня)
    currentDate() {
      let day = this.dayOnClick.number;
      let month = this.dayOnClick.month + 1;
      let year = this.dayOnClick.year;
      if (day < 10) {
        day = '0'+day;
      }
      if (month < 10) {
        month = '0'+month;
      }
      return year+'-'+month+'-'+day;
    },

    // название текущего месяца
    currentMonthName() {
      return this.monthsName[this.getMonth];
    },

    // перелистывание календаря
    slideMonth(next) {
      if (next) {
        if (this.getMonth > 10) {
          this.getMonth = 0;
          this.getYear++;
          this.currentMonth = this.createCurrentMonth(this.getYear, this.getMonth);
        } else {
          this.currentMonth = this.createCurrentMonth(this.getYear, this.getMonth+1);
          this.getMonth++;
        }
      } else {
        if (this.getMonth < 1) {
          this.getMonth = 11;
          this.getYear--;
          this.currentMonth = this.createCurrentMonth(this.getYear, this.getMonth);
        } else {
          this.currentMonth = this.createCurrentMonth(this.getYear, this.getMonth-1);
          this.getMonth--;
        }
      }
    },

    // собираем дни в объект месяца
    daysOfMonth(year, month) {
      let currentDate = new Date();
      let date = new Date(year, month);
      let monthDays = [];
      while (date.getMonth() === month) {
        monthDays[date.getDate()-1] = {
          number: date.getDate(),
          day: this.daysName[date.getDay() - 1] ? date.getDay() - 1 : 6,
          presentDay: date.getDate() === currentDate.getDate() && 
                    month === currentDate.getMonth() && 
                    year === currentDate.getFullYear() ? true : false,
          month: month,
          year: year,
        };
        date.setDate(date.getDate() + 1);
      }
      return monthDays;
    },

    monthToWeeks(month) {
      let resultMonth = [],
      week = 0,
      days = -1;
      resultMonth[0] = []
      for (let key in month) {
        if (days < 6) {
          days++;
        } else { 
          week++;
          days = 0;
          resultMonth[week] = []; 
        }
        resultMonth[week][days] = month[key];
        
      }
      return resultMonth;
    },

    createCurrentMonth(year, month) {
      let previousMonth = this.daysOfMonth(year, month-1).reverse();
      let currentMonth = this.daysOfMonth(year, month);
      let nextMonth = this.daysOfMonth(year, month+1);
      let result = [];
      if (!previousMonth.length) {
        previousMonth = this.daysOfMonth(year-1, 11).reverse();
      }
      if (!nextMonth.length) {
        nextMonth = this.daysOfMonth(year+1, 0);
      }

      for (let key in previousMonth) {
        if (previousMonth[key].day === 6) {
          break;
        }
        previousMonth[key].gray = true;
        result.push(previousMonth[key]);
      }

      result.reverse();
      
      for (let key in currentMonth) {
        result.push(currentMonth[key]);
        if (currentMonth[key].day === 5 || currentMonth[key].day === 6) {
          currentMonth[key].weekend = true;
        }
      }

      for (let key in nextMonth) {
        if (nextMonth[key].day === 0) {
          break;
        }
        nextMonth[key].gray = true;
        result.push(nextMonth[key]);
      }
      return this.monthToWeeks(result);
    },

    getCurrentMonthNumber() {
      let currentMonth = new Date();
      return currentMonth.getMonth();
    },

    getCurrentYear() {
      let currentMonth = new Date();
      return currentMonth.getFullYear();
    },


  },

  computed: {

    getCurrentMonthDays() {
      return this.createCurrentMonth(this.getYear, this.getMonth);
    },

  },
}
</script>

<style>
  .calendar {
    margin: 30px 0;
    border-color: #000;
  }
  .calendar__mouth {
    font-size: 24px;
  }
  .calendar__top {
    margin: 10px 0;
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
  .calendar__body {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .calendar__controller {
    width: 100%;
    padding: 0 99px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
</style>
