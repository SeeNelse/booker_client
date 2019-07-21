const sendQuery = require('./sendQuery');

module.exports = class AuthDB {

  // Записываем нового юзера в базу
  setRegistration(userData) {
    let userCheck = this.userCheck(userData);
    return userCheck.then(result => {
      if (!result.length) {
        let newUser = this.setNewUser(userData);
        return newUser.then(newUserResult => {
          if (newUserResult.serverStatus === 2) {
            return true;
          } else {
            return false;
          }
        });
      } else {
        return false;
      }
    })
  }
  setNewUser(userData) {
    let query = `
    INSERT INTO booker_users (user_name, user_pass, user_email, status, role_id, token) 
    VALUES ('${userData.username}', '${userData.password}', '${userData.email}', 'active', '2', '');`
    return sendQuery(query);
  }

  // записываем токен юзеру
  setLogInToken(userData, hash) {
    let query = `UPDATE booker_users SET token = '${hash}', log_in_time = '${userData.logInTime}' WHERE user_email = '${userData.email}';`
    return sendQuery(query);
  }

  // Проверка на свободный логин и имейл
  userCheck(userData) {
    let query = `SELECT * FROM booker_users WHERE user_name = '${userData.username}' AND user_email = '${userData.email}';`
    return sendQuery(query);
  }

  // Стягиваем данные для проверки имейла и пароля
  getLogInData(userData) {
    let query = `SELECT * FROM booker_users WHERE user_email = '${userData.email}';`;
    return sendQuery(query);
  }

}