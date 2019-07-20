const AuthDBClass = require('../database/AuthDB');
const AuthDB = new AuthDBClass();

const bcrypt = require('bcrypt');
const saltRounds = 10;
const emailValidator = require("email-validator");

module.exports = class Auth {

  setRegistration(userData) {
    userData = JSON.parse(Object.keys(userData)[0]);
    if (!emailValidator.validate(userData.email)) {
      return false;
    }
    if (userData.username.length < 4 || userData.username.length > 15) {
      return false;
    }
    if (userData.password.length < 4 || userData.password.length > 20) {
      return false;
    }

    // Хэшируем пароль и записываем в базу
    return bcrypt.hash(userData.password, saltRounds).then(hash => {
      userData.password = hash;
      return AuthDB.setRegistration(userData);
    });
  }

  getLogIn(userData) {
    userData = JSON.parse(Object.keys(userData)[0]);
    return (async () => {
      // Берем данные о юзере с базы
      let userDataFromDB = await AuthDB.getLogInData(userData);
      if (!userDataFromDB.length) {
        return false;
      }
      // Проверка имейла
      let checkPassResult = false;
      await bcrypt.compare(userData.password, userDataFromDB[0].user_pass).then(function(result) {
        if (result) {
          checkPassResult = true;
        }
      });
      if (!checkPassResult) {
        return false;
      }

      return bcrypt.hash(userDataFromDB[0].user_name+userDataFromDB[0].user_email, saltRounds).then(hash => {
        AuthDB.setLogInToken(userData, hash);
        return {name: userDataFromDB[0].user_name, token: hash, logInTime: userData.logInTime, userId: userDataFromDB[0].user_id, role: userDataFromDB[0].role_id};
      });

    })();
  }

}