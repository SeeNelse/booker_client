const dbData = require('../../config/config');
const mysql = require('mysql');

module.exports = class DataBase {

  constructor() {
    
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
      booker_event.recurrent_name,
      booker_event.recurrent_count,
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
  setNewEvent(object, date) {
    let reccurentCount;
    let reccurentType;
    // Проверка на рекурентность
    if (object.recurrent.status) {
      reccurentType = "'"+object.recurrent.type+"'";
      reccurentCount = object.recurrent['count'+object.recurrent.type];
    } else {
      reccurentType = null;
      reccurentCount = null;
    }

    return (async () => {
      let roomId = await this.getRoomId(object.room);
      let query = `
      INSERT INTO booker_event 
      (note, time_start, time_end, year, day, month, user_id, room_id, recurrent_name, recurrent_count) 
      VALUES ('${object.note}', '${object.startTime}', '${object.endTime}', '${date[0]}', 
              '${date[2]}', '${date[1]-1}', '1', '${roomId[0].room_id}', ${reccurentType}, ${reccurentCount});`;

      return this.sendQuery(query);
    })();
  }

  getRoomId(name) {
    let query = `SELECT room_id FROM booker_rooms WHERE room_name = '${name}'`
    return this.sendQuery(query);
  }

  sendQuery(query) {
    return new Promise((resolve, reject) => {
      this.mysqlServer = mysql.createConnection(dbData);
      this.mysqlServer.query(query, (error, result) => {
        if (error) {
          resolve(false);
        }
        resolve(result);
        this.mysqlServer.end();
      });
    });
  }

}
