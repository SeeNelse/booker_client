const EventsDBClass = require('../database/EventsDB');
const EventsDB = new EventsDBClass();

module.exports = class Events {

  constructor() {

  }

  // Запрос на получение списка ивентов в месяце
  getEventsForThisMonth(params) {
    if (
      !isNaN(+params.year) && 
      !isNaN(+params.month) &&
      params.year.length === 4 &&
      params.month.length <= 2
    ) {
      return EventsDB.getEventsForThisMonth(params);
    } else {
      return false;
    }
  }

  // Записываем новые значения в базу
  setNewEvent(data) {
    let event = JSON.parse(Object.keys(data)[0]);
    let date = event.date.split('-');
    let currentDate = {
      number: +date[2],
      year: +date[0],
      month: date[1]-1 
    }
    
    // Проверки 
    if (!event.room) {
      return false;
    }

    if (!event.date) {
      return false;
    }
 
    if (event.startTime >= event.endTime) {
      return false;
    }

    if (event.note.length > 250) {
      return false;
    }

    if (event.startTime < 300 || event.endTime > 1020) {
      return false;
    }

    if (
      event.recurrent.type === 'Weekly' && event.recurrent.countWeekly < 1 || 
      event.recurrent.type === 'Weekly' && event.recurrent.countWeekly > 4 ||
      event.recurrent.type === 'Biweekly' && event.recurrent.countBiweekly < 1 || 
      event.recurrent.type === 'Biweekly' && event.recurrent.countBiweekly > 2 ||
      event.recurrent.type === 'Monthly' && event.recurrent.countMonthly != 1
    ) {
      return false;
    }

    return EventsDB.setNewEvent(event, currentDate);
  }
}