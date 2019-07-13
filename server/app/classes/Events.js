const DataBaseClass = require('../database/DataBase');

module.exports = class Events {

  constructor() {
    this.DataBase = new DataBaseClass();
  }

  getEventsForThisMonth(params) {
    if (
      !isNaN(+params.year) && 
      !isNaN(+params.month) &&
      params.year.length === 4 &&
      params.month.length <= 2
    ) {
      return this.DataBase.getEventsForThisMonth(params);
    } else {
      return false;
    }
  }

  setNewEvent(params) {
    console.log(Object.keys(params)[0]);
  }

}