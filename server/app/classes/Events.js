const DataBaseClass = require('../database/DataBase');

module.exports = class Events {

  constructor() {
    this.DataBase = new DataBaseClass();
  }

  // Запрос на получение списка ивентов в месяце
  getEventsForThisMonth(params) {
    if (
      !isNaN(+params.year) && 
      !isNaN(+params.month) &&
      params.year.length === 4 &&
      params.month.length <= 2
    ) {
      return this.DataBase.getEventsForThisMonth(params);
    } else {
      return false;
    }
  }

  // Записываем новые значения в базу
  setNewEvent(params) {
    let event = JSON.parse(Object.keys(params)[0]);
    let date = event.date.split('-');
    let timeCheck = this.newEventTimeCheck(event, date);
    // ПРОВЕРКИ
    return timeCheck.then(param => {
      if (param) {
        console.log(param);
        return this.DataBase.setNewEvent(event, date);
      } else {
        //
        return false;
      }
    });
  }

  // Проверяем время на совпадение
  newEventTimeCheck(event, date) {
    let startTime = new Date(event.startTime);
    let startTimeMin = startTime.getHours() * 60 + startTime.getMinutes();
    let endTime = new Date(event.endTime);
    let endTimeMin = endTime.getHours() * 60 + endTime.getMinutes();

    return (async () => {
      let eventForThisMonth = await this.DataBase.getEventsForThisMonth({year: date[0], month: +date[1]-1});
      if (!eventForThisMonth.length) {
        return true;
      }

      let coincidenceFlag;
      for (let eventItem in eventForThisMonth) {
        let startTimeEvent = new Date(eventForThisMonth[eventItem].time_start);
        let startTimeEventMin = startTimeEvent.getHours() * 60 + startTimeEvent.getMinutes();
        let endTimeEvent = new Date(eventForThisMonth[eventItem].time_end);
        let endTimeMinEvent = endTimeEvent.getHours() * 60 + endTimeEvent.getMinutes();

        // перебор всех записей месяца
        if (startTimeMin >= startTimeEventMin && startTimeMin < endTimeMinEvent) {
          coincidenceFlag = false;
          return false;
        } else {
          if (endTimeMin > startTimeEventMin && endTimeMin < endTimeMinEvent) {
            coincidenceFlag = false;
            return false;
          } else {
            console.log(startTimeMin, startTimeEventMin, startTimeMin , endTimeMinEvent);
            coincidenceFlag = true;
          }
        }
      }

      if (coincidenceFlag) {
        return true;
      } else {
        return false;
      }
    })();
  }


}