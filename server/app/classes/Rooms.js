const RoomsDBClass = require('../database/RoomsDB');
const RoomsDB = new RoomsDBClass();

module.exports = class Rooms {

  getRooms() {
    return RoomsDB.getRooms();
  }

}