<template>
  <fragment>
    <b-row>
      <b-col cols="3">
        <SideBar :roomList='roomList' />
        <SelectedEvent :selectedEventsObj='selectedEventsObj' />
      </b-col>
      <b-col cols="9">
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
            <Week 
              v-for='(week, index) in getCurrentMonthDays' 
              :key='index' 
              :week='week' 
              :modalNewEventHandler='modalNewEventHandler'
              :windowEventHandler='windowEventHandler'
              :selectRoomsValue='selectRoomsValue'
            />
          </div>
        </div>
      </b-col>
    </b-row>

    <b-modal id="newEvent" title="Book room" hide-footer>
      <NewEvent 
        :roomList='roomList' 
        :currentDate='currentDate()' 
        :getEventsForThisMonth='getEventsForThisMonth' 
        :dayOnClick='dayOnClick'
      />
    </b-modal>

  </fragment>
</template>

<script>
import Week from '@/components/Week';
import DaysOfWeek from '@/components/DaysOfWeek';
import NewEvent from '@/components/NewEvent';
import SelectedEvent from '@/components/SelectedEvent';
import SideBar from '@/components/SideBar';
import store from '@/Store';
import serverUrl from '@/config';
import axios from 'axios';

export default {
  name: 'Month',
  components: {
    Week, 
    DaysOfWeek,
    NewEvent,
    SelectedEvent,
    SideBar,
  },
  data() {
    return {
      getMonth: this.getCurrentMonthNumber(),
      getYear: this.getCurrentYear(),
      mondayStart: false,
      monthsName: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      dayOnClick: {},
      eventForThisMonth: [],
      selectedEventsObj: {},
      roomList: []
    }
  },
  created() {
    this.getEventsForThisMonth();
    this.getRoomNames();
  },
  methods: {
    // фетч ивентов на текущий месяц
    getEventsForThisMonth() {
      axios.get(`${serverUrl}/api/event/${this.getYear}/${this.getMonth}`)
        .then(response => {
          if (response.status === 404) {
            this.eventForThisMonth = [];
            return false;
          }
          this.eventForThisMonth = response.data;
        })
        .catch(error => {
          console.log(error);
        });
    },

    // стягиваем комнаты
    getRoomNames() {
      axios.get(`${serverUrl}/api/rooms/get/`)
        .then(response => {
          if (response.data.length) {
            this.roomList = response.data;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    // вызов поп-апа "новый ивент"
    modalNewEventHandler(day) {
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
      }
    },

    // окно ивентов
    windowEventHandler(event) {
      this.selectedEventsObj = event;
    },
    
    // логика календаря

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
      this.eventForThisMonth = [];
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
        if (this.mondayStart) {
          monthDays[date.getDate()-1] = {
            number: date.getDate(),
            day: date.getDay(),
            presentDay: date.getDate() === currentDate.getDate() && 
                      month === currentDate.getMonth() && 
                      year === currentDate.getFullYear() ? true : false,
            month: month,
            year: year,
            events: [],
            scanned: false
          };
        } else {
          monthDays[date.getDate()-1] = {
            number: date.getDate(),
            day: this.daysName[date.getDay() - 1] ? date.getDay() - 1 : 6,
            presentDay: date.getDate() === currentDate.getDate() && 
                      month === currentDate.getMonth() && 
                      year === currentDate.getFullYear() ? true : false,
            month: month,
            year: year,
            events: [],
            scanned: false
          };
        }
        // monthDays[date.getDate()-1] = {
        //   number: date.getDate(),
        //   day: this.daysName[date.getDay() - 1] ? date.getDay() - 1 : 6,
        //   presentDay: date.getDate() === currentDate.getDate() && 
        //             month === currentDate.getMonth() && 
        //             year === currentDate.getFullYear() ? true : false,
          
        // };
        monthDays[date.getDate()-1].fullDate = monthDays[date.getDate()-1].year + '-' + // строка в виде "yyyy-mm-dd"
          (monthDays[date.getDate()-1].month < 10 ? '0' + monthDays[date.getDate()-1].month : monthDays[date.getDate()-1].month) + '-' + 
          (monthDays[date.getDate()-1].number < 10 ? '0' + monthDays[date.getDate()-1].number : monthDays[date.getDate()-1].number);

        // Добавляем ивенты в нужные дни
        if (this.getMonth === month) { // проверка на текущий месяц
          let events = this.eventForThisMonth;
          events.map(el => {
            if (el.day === monthDays[date.getDate()-1].number) {
              monthDays[date.getDate()-1].events.push(el)
            }
          });
        };

        date.setDate(date.getDate() + 1);
      }
      return monthDays;
    },

    // создаем объект месяца и соседних месяцев
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
        if (this.mondayStart) {
          if (currentMonth[key].day === 0 || currentMonth[key].day === 6) {
            currentMonth[key].weekend = true;
          }
        } else {
          if (currentMonth[key].day === 5 || currentMonth[key].day === 6) {
            currentMonth[key].weekend = true;
          }
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

    // ВСПОМНИ ЧТО ЭТО И ДОПИШИ
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

    // текущий месяц
    getCurrentMonthNumber() {
      let currentMonth = new Date();
      return currentMonth.getMonth();
    },

    // текущий год
    getCurrentYear() {
      let currentMonth = new Date();
      return currentMonth.getFullYear();
    },


  },
  computed: {
    // стягиваем месяцы при листании календаря
    getCurrentMonthDays() {
      return this.createCurrentMonth(this.getYear, this.getMonth);
    },

    daysName() {
      this.eventForThisMonth = [];
      this.getEventsForThisMonth();
      if (store.getters.startDay) {
        this.mondayStart = true;
        return ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
      } else {
        this.mondayStart = false;
        return ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
      }
    },

    selectRoomsValue: {
      get () {
        return store.state.selectRoomsValue
      },
    },
  },
  watch: {
    // стягиваем ивенты при листании календаря
    getMonth() {
      this.getEventsForThisMonth();
    }
  }
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
    background: #17a2b8;
    margin-top: 10px;
    padding: 10px 0;
    color: #ffffff;
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
  .calendar__body {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
  }
  .calendar__controller {
    width: 100%;
    padding: 0 99px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

</style>
