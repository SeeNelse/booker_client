const sendQuery = require('./sendQuery');

const CreateMonthsClass = require('../helpers/CreateMonths');
const CreateMonths = new CreateMonthsClass();

module.exports = class DataBase {

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
    WHERE year = '${params.year}' AND month = '${params.month}'
    ORDER BY time_start`;
    return sendQuery(query);
  }

  // Записываем новый ивент
  setNewEvent(event, date) {
    if (event.recurrent.status) { // Если есть рекурентность
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
      return `INSERT INTO booker_event 
        (note, time_start, time_end, year, day, month, user_id, room_id, recurrent_type, recurrent_id) 
        VALUES ('${event.note}', '${event.startTime}', '${event.endTime}', '${date.year}', 
        '${date.number}', '${date.month}', '${event.userId}', '${event.room}', '${event.recurrent.type}', ${recurrentId});`;
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
  getRecurrentValues(event, date, parentId) {
    return (async () => {
      return `('${event.note}', '${event.startTime}', '${event.endTime}', '${date.year}', '${date.number}', '${date.month}', '${event.userId}', '${event.room}', ${parentId}, null),`;
    })();
  }

  // Генерация запроса для проверки ивентов в нужную дату
  getEventsForThisDay(date, event) {
    let query = `
    SELECT 
      booker_event.time_start,
      booker_event.time_end,
      booker_event.year,
      booker_event.day,
      booker_event.month,
      booker_event.event_id
    FROM booker_event
    INNER JOIN booker_rooms
    ON booker_event.room_id = booker_rooms.room_id
    WHERE booker_event.year = '${date.year}' 
    AND booker_event.month = '${date.month}' 
    AND booker_event.day = '${(date.number || date.day)}'
    AND booker_rooms.room_id = '${event.room || date.room_id}' `;
    return sendQuery(query); 
  }

  // Запрос на ивент, который необходимо удалить
  getCheckEventForDeleteAndEdit(id) {
    let query = `SELECT * FROM booker_event WHERE event_id = '${id}'`;
    return sendQuery(query);
  }

  // Удалить ивент
  deleteEvent(Id) {
    let query = `DELETE FROM booker_event WHERE event_id IN (${Id});`;
    return sendQuery(query);
  }

  // Стянуть ивенты для проверки при апдейте
  getEventForRecurrentEdit(id, recurrent) {
    let query = '';
    if (recurrent) {
      query = `SELECT * FROM booker_event WHERE event_id = '${id}' OR recurrent_type = '${id}'`;
    } else {
      query = `SELECT * FROM booker_event WHERE event_id = '${id}'`;
    }
    return sendQuery(query);
  }

  setEditEvent(item, event) {
    let query = `
      UPDATE booker_event 
      SET user_id = '${event.userId}', 
      time_start = '${event.startTime}', 
      time_end = '${event.endTime}', 
      note = '${event.note}' 
      WHERE event_id = '${item.event_id}';`;
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
      let lastIdQuery = "SELECT `AUTO_INCREMENT` FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'user8' AND TABLE_NAME = 'booker_event'";
      let currentId = await sendQuery(lastIdQuery);
      currentId = currentId[0]['AUTO_INCREMENT'];
      let parentId = currentId;

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
      let recurrentValues = await this.getCheckAndGenerateQuerys(event, recurrentDates, false, parentId); 
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
        if (element.number === date.number && element.month === date.month + 1) {
          if (element.day === 6) {
            recurrentDates.push(calendar[index + 2]);
          }
          if (element.day === 0) {
            calendar[index + 1]
            recurrentDates.push(calendar[index + 1]);
          }
          if (element.day !== 0 && element.day !== 6) {
            recurrentDates.push(element);
          }
        }
        if (!recurrentDates.length && date.month+2 === element.month) {
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
      }
    });
    return recurrentDates;
  }

  // Проверка свободного времени и генерация значений для рекурентов
  getCheckAndGenerateQuerys(event, recurrentDates, check, parentId) {
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
          querys += await this.getRecurrentValues(event, element, parentId);
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
    return (async () => {
      let eventForThisMonth = await this.getEventsForThisDay(date, event);
      if (!eventForThisMonth.length) {
        return true;
      }
      let coincidenceFlag;
      for (let eventItem in eventForThisMonth) {
        // перебор всех записей месяца
        if (eventForThisMonth[eventItem].event_id === date.event_id) {
          coincidenceFlag = true;
        } else {
          if (event.startTime >= eventForThisMonth[eventItem].time_start && event.startTime < eventForThisMonth[eventItem].time_end) {
            coincidenceFlag = false;
            return false;
          } else {
            if (event.endTime > eventForThisMonth[eventItem].time_start && event.endTime < eventForThisMonth[eventItem].time_end) {
              coincidenceFlag = false;
              return false;
            } else {
              coincidenceFlag = true;
            }
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