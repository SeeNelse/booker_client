const RoomsDBClass = require('../database/RoomsDB');
const RoomsDB = new RoomsDBClass();

module.exports = class Events {

  gerRooms() {
    return RoomsDB.gerRooms();
  }

}