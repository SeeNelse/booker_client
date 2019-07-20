const sendQuery = require('./sendQuery');

module.exports = class RoomsDB {

  getRooms() {
    let query = "SELECT * FROM booker_rooms";
    return sendQuery(query);
  }

}