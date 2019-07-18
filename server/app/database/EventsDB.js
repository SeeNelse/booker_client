const sendQuery = require('./sendQuery');

const CreateMonthsClass = require('../helpers/CreateMonths');
const CreateMonths = new CreateMonthsClass();

module.exports = class DataBase {

  constructor() {
    
  }

  // sendQuery(query) {
  //   return new Promise((resolve, reject) => {
  //     pool.getConnection(function(err, connection) {
  //       if (err) throw err;
  //       connection.query(query, function (error, results, fields) {
  //         connection.release();
  //         if (error) throw error;
  //         resolve(results);
  //       });
  //     });


  //   //   this.mysqlServer = mysql.createConnection(dbData);
  //   //   this.mysqlServer.query(query, (error, result) => {
  //   //     if (error) {
  //   //       resolve(false);
  //   //     }
  //   //     this.mysqlServer.end(error => {
  //   //       resolve(result);
  //   //     });
  //   //   });
  //   });
    
  // }

  // Получаем все ивенты месяца
  getEventsForThisMonth(params) {
    let query = `
    SELECT 
      booker_event.event_id,
      booker_event.time_start,
      booker_event.time_end,
      booker_event.note,
      booker_event.year,
      booker_event.day,
      booker_event.month,
      booker_event.recurrent_type,
      booker_event.recurrent_id,
      booker_event.user_id,
      booker_event.room_id,
      booker_users.user_name,
      booker_rooms.room_name
    FROM booker_event
    INNER JOIN booker_users
    ON booker_event.user_id = booker_users.user_id
    INNER JOIN booker_rooms
    ON booker_event.room_id = booker_rooms.room_id
    WHERE year = '${params.year}' AND month = '${params.month}'`;
    return sendQuery(query);
  }

  // Записываем новый ивент
  setNewEvent(event, date) {
    if (event.recurrent.status) {
      const calendar = CreateMonths.getCalendar(date.year, date.month);
      if (event.recurrent.type === 'Weekly') {

        let recurrentDates = this.getRecurrentsDates(event, date, calendar, 7);
        return this.setRecurrentEvents(event, recurrentDates, date);

      } else if (event.recurrent.type === 'Biweekly') {

        let recurrentDates = this.getRecurrentsDates(event, date, calendar, 14);
        return this.setRecurrentEvents(event, recurrentDates, date);

      } else if (event.recurrent.type === 'Monthly') {

        let recurrentDates = this.getRecurrentsDates(event, date, calendar, 'monthly');
        return this.setRecurrentEvents(event, recurrentDates, date);
      }
    } else {
      let timeCheck = this.newEventTimeCheck(event, date); // Чекаем время на повторение
      return timeCheck.then(param => {
        if (param) {
          return (async () => {
            let query = await this.getNewEventQuery(event, date);
            return sendQuery(query);
          })();
        } else {
          return false;
        }
      });
    }
  }

  // Генерация запроса для одной записи
  getNewEventQuery(event, date, recurrentId = null) {
    return (async () => {
      console.log(event);
      // let roomId = await this.getRoomId(event.room);
      return `INSERT INTO booker_event 
        (note, time_start, time_end, year, day, month, user_id, room_id, recurrent_type, recurrent_id) 
        VALUES ('${event.note}', '${event.startTime}', '${event.endTime}', '${date.year}', 
        '${date.number}', '${date.month}', '1', '${event.room}', false, ${recurrentId});`;
    })();
  }
  
  // Генерация запросов для рекурентов
  getNewEventRecurrentQuery(values) {
    return (async () => {
      return `INSERT INTO booker_event 
        (note, time_start, time_end, year, day, month, user_id, room_id, recurrent_type, recurrent_id) 
        VALUES ${values};`;
    })();
  }

  // Генерация значений для рекурентов
  getRecurrentValues(event, date) {
    return (async () => {
      let roomId = await this.getRoomId(event.room);
      return `('${event.note}', '${event.startTime}', '${event.endTime}', '${date.year}', '${date.number}', '${date.month}', '1', '${roomId[0].room_id}', true, null),`;
    })();
  }

  // Генерация запроса для апдейта
  // getUpdateEventQuery(event, date, recurrentId = null) {
  //   return (async () => {
  //     let roomId = await this.getRoomId(event.room);
  //     return `INSERT INTO booker_event 
  //       (note, time_start, time_end, year, day, month, user_id, room_id, recurrent_type, recurrent_id) 
  //       VALUES ('${event.note}', '${event.startTime}', '${event.endTime}', '${date.year}', 
  //       '${date.number}', '${date.month}', '1', '${roomId[0].room_id}', false, ${recurrentId});`;
  //   })();
  // }

  // Генерация запроса для проверки ивентов в нужную дату
  getEventsForThisDay(date, event) {
    let query = `
    SELECT 
      booker_event.time_start,
      booker_event.time_end,
      booker_event.year,
      booker_event.day,
      booker_event.month
    FROM booker_event
    INNER JOIN booker_rooms
    ON booker_event.room_id = booker_rooms.room_id
    WHERE booker_event.year = '${date.year}' 
    AND booker_event.month = '${date.month}' 
    AND booker_event.day = '${date.number}'
    AND booker_rooms.room_id = ${event.room} `;
    return sendQuery(query); 
  }

  // Генерация запрос для получения айди комнаты
  getRoomId(name) {
    let query = `SELECT room_id FROM booker_rooms WHERE room_name = '${name}'`
    return sendQuery(query);
  }

  // Запись ивентов с рекурентами.
  setRecurrentEvents(event, recurrentDates, date) {
    return (async () => {
      // Проверка занятого времени
      let timeIsBusy = await this.getCheckAndGenerateQuerys(event, recurrentDates, true);
      if (timeIsBusy) {
        return false;
      }

      // Забираем последний айди для вычисления айди рекурентов
      let lastIdQuery = 'SELECT MAX(event_id) FROM booker_event;'
      let currentId = await sendQuery(lastIdQuery);
      currentId = currentId[0]['MAX(event_id)'] + 1;
      
      // собираем айди рекурентов
      let recurrentId = [];
      for (var i = 0; i < recurrentDates.length; i++) {
        currentId++;
        recurrentId.push(currentId);
      }

      // Записываем основную запись
      let mainQuery = await this.getNewEventQuery(event, date, "'"+recurrentId+"'");
      let mainQueryResult = await sendQuery(mainQuery);

      if (mainQueryResult.serverStatus !== 2) {
        return false;
      }
      
      // Генерируем квери и записываем записи рекурентов
      let recurrentValues = await this.getCheckAndGenerateQuerys(event, recurrentDates, false);
      let recurrentQuerys = await this.getNewEventRecurrentQuery(recurrentValues);
      let recurrentResult = await sendQuery(recurrentQuerys);

      if (recurrentResult.serverStatus !== 2) {
        return false;
      } else {
        return true;
      }
    })();
  }

  // Генерация дат для рекурентов
  getRecurrentsDates(event, date, calendar, recurrentDays) {
    let recurrentDates = [];
    calendar.forEach((element, index) => {
      if (recurrentDays !== 'monthly') { // Если через неделю или две
        if (element.month === date.month && element.number === +date.number) {
          let currentDateIndex = index;
          for (let i = -1; i < +event.recurrent['count'+event.recurrent.type]; i++) {
            if (currentDateIndex != index) {
              recurrentDates.push(calendar[currentDateIndex]);
            }
            currentDateIndex = currentDateIndex + recurrentDays;
          }
        }
      } else { // Если через месяц
        if (date.month+2 === element.month) {
          if (calendar[index - 1].month !== element.month) {
            recurrentDates.push(calendar[index - 1]);
            if (recurrentDates[0].day === 6) {
              recurrentDates[0] = calendar[index];
            }
            if (recurrentDates[0].day === 0) {
              recurrentDates[0] = calendar[index + 1];
            }
          }
        }
        if (element.number === date.number && element.month === date.month + 1) {
          if (element.day === 6) {
            recurrentDates.push(calendar[index + 2]);
          }
          if (element.day === 0) {
            calendar[index + 1]
            recurrentDates.push(calendar[index + 1]);
          }
        }
      }
    });
    return recurrentDates;
  }

  // Проверка свободного времени и генерация значений для рекурентов
  getCheckAndGenerateQuerys(event, recurrentDates, check) {
    // Вспомогательные функции для перебора массива с промисами
    const waitFor = (ms) => new Promise(r => setTimeout(r, ms));
    async function asyncForEach(array, callback) {
      for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
      }
    }
    // Проверка на занятое время/генерация значений для запросов
    const checkAndGetQuerys = async (check) => {
      let timeIsBusy = false; // Флаг для проверки на время
      let querys = '';
      await asyncForEach(recurrentDates, async (element) => {
        await waitFor(20);
        if (check) { // Проверка
          let checkResult = await this.newEventTimeCheck(event, element);
          if(!checkResult) {
            timeIsBusy = true;
          }
        } else { // Генерация
          querys += await this.getRecurrentValues(event, element);
        }
      });
      if (querys) {
        return querys.slice(0, -1);
      } else {
        return timeIsBusy;
      }
    }

    return checkAndGetQuerys(check);
  }

  // Проверяем время на совпадение
  newEventTimeCheck(event, date) {
    let startTime = new Date(event.startTime);
    let endTime = new Date(event.endTime);
    let minTimes = {
      startTimeMin: startTime.getHours() * 60 + startTime.getMinutes(),
      endTimeMin: endTime.getHours() * 60 + endTime.getMinutes()
    }
    return (async () => {
      let eventForThisMonth = await this.getEventsForThisDay(date, event);
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
        if (minTimes.startTimeMin >= startTimeEventMin && minTimes.startTimeMin < endTimeMinEvent) {
          coincidenceFlag = false;
          return false;
        } else {
          if (minTimes.endTimeMin > startTimeEventMin && minTimes.endTimeMin < endTimeMinEvent) {
            coincidenceFlag = false;
            return false;
          } else {
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