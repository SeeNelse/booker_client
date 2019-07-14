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
      booker_users.user_name,
      booker_rooms.room_name
    FROM booker_event
    INNER JOIN booker_users
    ON booker_event.user_id = booker_users.user_id
    INNER JOIN booker_rooms
    ON booker_event.room_id = booker_rooms.room_id
    WHERE year = '${params.year}' AND month = '${params.month}'`;
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

        return (async () => {

          let res1 = await this.newEventTimeCheck(event, recurrentDates[0])
          let res2 = await this.newEventTimeCheck(event, recurrentDates[1])
          let res3 = await this.newEventTimeCheck(event, recurrentDates[2])
          let res4 = await this.newEventTimeCheck(event, recurrentDates[3])

          if (!res1 || !res2 || !res3 || !res4) {
            return false;
          }
          // достать последний айди

          (async () => {
            // let query = await this.setNewEventToDb(event, date);

            // await recurrentDates.forEach(element => {

            //   (async () => {
            //     query += await this.setNewEventToDb(event, element);
            //     console.log(1);
            //   })();

            // });
            // console.log(2);
            // let lastIdQuery = 'SELECT MAX(event_id) FROM booker_event;'
            // // console.log(lastIdQuery);
            // const lastId = await this.sendQuery(lastIdQuery);
            // // console.log(lastId);

            

          })();

          // for (let i = 0; i <= recurrentDates.length; i++) {
            
          //   if (!recurrentDates[i]) {

          //   }
          // }

        })();



        // console.log(recurrentDates.length);
        // recurrentDates.map((el) => {
        //   console.log(el);
        // });


        // return (async () => {

        //   let timeCheck;

        //   for (let i = 0; i < recurrentDates.length; i++) {
        //     timeCheck = await this.newEventTimeCheck(event, recurrentDates[i]);
        //     if (!timeCheck) {
        //       break;
        //     }
        //   }

        //   timeCheck.then(res => console.log(res))

        // })();
      }

    } else {

      let timeCheck = this.newEventTimeCheck(event, date); // Чекаем время на повторение
      return timeCheck.then(param => {
        if (param) {
          return (async () => {
            let query = await this.setNewEventToDb(event, date);
            return this.sendQuery(query);
          })();
        } else {
          return false;
        }
      });
    }
  }

  setNewEventToDb(event, date) {
    return (async () => {
      let roomId = await this.getRoomId(event.room);
      return `INSERT INTO booker_event 
        (note, time_start, time_end, year, day, month, user_id, room_id, recurrent_type, recurrent_id) 
        VALUES ('${event.note}', '${event.startTime}', '${event.endTime}', '${date.year}', 
        '${date.number}', '${date.month}', '1', '${roomId[0].room_id}', false, null); `;
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