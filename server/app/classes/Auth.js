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
    return bcrypt.hash(userData.password, saltRounds).then(function(hash) {
      userData.password = hash;
      return AuthDB.setRegistration(userData);
    });

  }

}