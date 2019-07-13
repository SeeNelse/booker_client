const dbData = require('../../config/config');
const mysql = require('mysql');

module.exports = class DataBase {

  constructor() {
    
  }

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
