<template>
  <div>
    <div class="calendar__wrapper">
      <div class="calendar__top">
        <span class="calendar__prev" @click="slideMonth(false)">Туда</span>
        <span class="calendar__mouth">{{currentMonthName()}} {{ getYear }}</span>
        <span class="calendar__next" @click="slideMonth(true)">Сюда</span>
      </div>
      <table class="calendar">
        <thead>
          <tr>
            <DaysOfWeek v-for='(item, index) in daysName' :item='item' :key='index'></DaysOfWeek>
          </tr>
        </thead>
        <tbody>
          <Week :create-current-month='getCurrentMonthDays' v-for='(week, index) in getCurrentMonthDays' :key='index' :week='week'></Week>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import Week from '@/components/Week';
import DaysOfWeek from '@/components/DaysOfWeek';

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
      monthsName: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    }
  },
  methods: {

    currentMonthName() {
      return this.monthsName[this.getMonth];
    },

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

    daysOfMonth(year, month) {
      let currentDate = new Date();
      // формируем объект дат для месяца
      let date = new Date(year, month);
      let monthDays = [];
      while (date.getMonth() === month) {
        monthDays[date.getDate()-1] = {
          number: date.getDate(),
          day: this.daysName[date.getDay() - 1] ? date.getDay() - 1 : 6,
          presentDay: date.getDate() === currentDate.getDate() && 
                    month === currentDate.getMonth() && 
                    year === currentDate.getFullYear() ? true : false,
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

  }
}
</script>

<style>

</style>
