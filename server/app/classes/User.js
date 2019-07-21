const UserDBClass = require('../database/UserDB');
const UserDB = new UserDBClass();

module.exports = class User {

  getUsers() {
    return UserDB.getUsers();
  }

}