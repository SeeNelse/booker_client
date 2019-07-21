const sendQuery = require('./sendQuery');

module.exports = class UserDB {

  getUsers() {
    let query = `SELECT * FROM booker_users`;
    return sendQuery(query);
  }

}