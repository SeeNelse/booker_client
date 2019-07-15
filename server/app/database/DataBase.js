const dbData = require('../../config/config');
const mysql = require('mysql');
const pool  = mysql.createPool(dbData);

const CreateMonthsClass = require('../helpers/CreateMonths');
const CreateMonths = new CreateMonthsClass();

module.exports = class DataBase {

  constructor() {
    
  }

  sendQuery(query) {
    return new Promise((resolve, reject) => {
      pool.getConnection(function(err, connection) {
        if (err) throw err;
        connection.query(query, function (error, results, fields) {
          connection.release();
          if (error) throw error;
          resolve(results);
        });
      });


    //   this.mysqlServer = mysql.createConnection(dbData);
    //   this.mysqlServer.query(query, (error, result) => {
    //     if (error) {
    //       resolve(false);
    //     }
    //     this.mysqlServer.end(error => {
    //       resolve(result);
    //     });
    //   });
    });
    
  }

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

      booker_rooms.room_name
    FROM booker_event

    INNER JOIN booker_rooms
    ON booker_event.room_id = booker_rooms.room_id
    WHERE year = '${params.year}' AND month = '${params.month}'`;
    // Нормальный запрос, использовать в итоге ЕГО!!!!!!
    // let query = `
    // SELECT 
    //   booker_event.event_id,
    //   booker_event.time_start,
    //   booker_event.time_end,
    //   booker_event.note,
    //   booker_event.year,
    //   booker_event.day,
    //   booker_event.month,
    //   booker_event.recurrent_type,
    //   booker_event.recurrent_id,
    //   booker_event.user_id,
    //   booker_users.user_name,
    //   booker_rooms.room_name
    // FROM booker_event
    // INNER JOIN booker_users
    // ON booker_event.user_id = booker_users.user_id
    // INNER JOIN booker_rooms
    // ON booker_event.room_id = booker_rooms.room_id
    // WHERE year = '${params.year}' AND month = '${params.month}'`;
    return this.sendQuery(query);
  }

  // Записываем новый ивент
  setNewEvent(event, date) {
    if (event.recurrent.status) {
      const calendar = CreateMonths.getCalendar(date.year, date.month);
      if (event.recurrent.type === 'Weekly') {
        let recurrentDates = [];

        calendar.forEach((element, index) => {
          if (element.month === date.month && element.number === +date.number) {
            let currentDateIndex = index;
            for (let i = 0; i < +event.recurrent.countWeekly+1; i++) {
              if (currentDateIndex != index) {
                recurrentDates.push(calendar[currentDateIndex]);
              }
              currentDateIndex = currentDateIndex + 7;
            }
          }
        });

        const waitFor = (ms) => new Promise(r => setTimeout(r, ms));
        async function asyncForEach(array, callback) {
          for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array);
          }
        }

        let timeIsBusy = false; // Флаг для проверки на время
        const checkAndGetQuerys = async (check) => {
          let querys = '';
          await asyncForEach(recurrentDates, async (element) => {
            await waitFor(20);
            if (check) { // Проверка на занятое время
              let checkResult = await this.newEventTimeCheck(event, element);
              if(!checkResult) {
                timeIsBusy = true;
              }
            } else { // Генерация значений для запросов
              querys += await this.getReccurentValues(event, element);
            }
          });
          if (querys) {
            return querys.slice(0, -1);
          }
        }

        return (async () => {
          await checkAndGetQuerys(true);
          if (timeIsBusy) {
            return false;
          }
          // Если проверку на время прошли, записываем в базу:
          let lastIdQuery = 'SELECT MAX(event_id) FROM booker_event;'
          let currentId = await this.sendQuery(lastIdQuery);
          currentId = currentId[0]['MAX(event_id)'] + 1;
          
          // собираем айди рекурентов
          let recurrentId = [];
          for (var i = 0; i < recurrentDates.length; i++) {
            currentId++;
            recurrentId.push(currentId);
          }

          // Записываем основную запись
          let mainQuery = await this.getNewEventQuery(event, date, "'"+recurrentId+"'");
          let mainQueryResult = await this.sendQuery(mainQuery);
          if (!mainQueryResult.serverStatus === 2) {
            return false;
          }
          
          // Генерируем квери и записываем записи рекурентов
          let recurrentValues = await checkAndGetQuerys(false);
          let recurrentQuerys = await this.getNewEventRecurrentQuery(recurrentValues);
          console.log(1111111, recurrentQuerys);
          let recurrentResult = await this.sendQuery(recurrentQuerys);
          if (!recurrentResult.serverStatus === 2) {
            console.log(11111111);
            return false;
          } else {
            console.log(22222222);
            return true;
          }
        })();
      }

    } else {
      let timeCheck = this.newEventTimeCheck(event, date); // Чекаем время на повторение
      return timeCheck.then(param => {
        if (param) {
          return (async () => {
            let query = await this.getNewEventQuery(event, date);
            return this.sendQuery(query);
          })();
        } else {
          return false;
        }
      });
    }
  }

  getNewEventQuery(event, date, recurrentId = null) {
    return (async () => {
      let roomId = await this.getRoomId(event.room);
      return `INSERT INTO booker_event 
        (note, time_start, time_end, year, day, month, user_id, room_id, recurrent_type, recurrent_id) 
        VALUES ('${event.note}', '${event.startTime}', '${event.endTime}', '${date.year}', 
        '${date.number}', '${date.month}', '1', '${roomId[0].room_id}', false, ${recurrentId});`;
    })();
  }
  
  getNewEventRecurrentQuery(values) {
    return (async () => {
      return `INSERT INTO booker_event 
        (note, time_start, time_end, year, day, month, user_id, room_id, recurrent_type, recurrent_id) 
        VALUES ${values};`;
    })();
  }

  getReccurentValues(event, date) {
    return (async () => {
      let roomId = await this.getRoomId(event.room);
      return `('${event.note}', '${event.startTime}', '${event.endTime}', '${date.year}', '${date.number}', '${date.month}', '1', '${roomId[0].room_id}', true, null),`;
    })();
  }

  getUpdateEventQuery(event, date, recurrentId = null) {
    return (async () => {
      let roomId = await this.getRoomId(event.room);
      return `INSERT INTO booker_event 
        (note, time_start, time_end, year, day, month, user_id, room_id, recurrent_type, recurrent_id) 
        VALUES ('${event.note}', '${event.startTime}', '${event.endTime}', '${date.year}', 
        '${date.number}', '${date.month}', '1', '${roomId[0].room_id}', false, ${recurrentId});`;
    })();
  }

  getRoomId(name) {
    let query = `SELECT room_id FROM booker_rooms WHERE room_name = '${name}'`
    return this.sendQuery(query);
  }

  getEventsForThisDay(date) {
    let query = `
    SELECT 
      booker_event.time_start,
      booker_event.time_end,
      booker_event.year,
      booker_event.day,
      booker_event.month
    FROM booker_event
    WHERE year = '${date.year}' AND month = '${date.month}' AND day = '${date.number}'`;
    return this.sendQuery(query); 
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
      let eventForThisMonth = await this.getEventsForThisDay(date);
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