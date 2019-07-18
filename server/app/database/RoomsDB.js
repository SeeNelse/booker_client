const sendQuery = require('./sendQuery');

module.exports = class RoomsDB {

  gerRooms() {
    let query = "SELECT * FROM booker_rooms";
    return sendQuery(query);
  }

}