const UserDBClass = require('../database/UserDB');
const UserDB = new UserDBClass();

module.exports = class User {

  getUsers() {
    return UserDB.getUsers();
  }

  blockUser(userInfo) {
    let user = JSON.parse(Object.keys(userInfo)[0]);
    if (user.adminRole === 1 && user.userRole !== 1) {
      return UserDB.blockUser(user);
    }
  }

}