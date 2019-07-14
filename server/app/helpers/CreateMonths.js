module.exports = class CalendarMonths {

  getCalendar(year, month) {
    var date = new Date(year, month);
    let currentMonth = this.createCurrentMonth(date, month, dates);
    let secondMonth = this.createSecondMonth(date, month+1, dates);
    var dates = [...currentMonth, ...secondMonth];
    return dates;
  }

  createCurrentMonth(date, month, dates) {
    const currentMonth = [];
    while (date.getMonth() === month) {
      currentMonth.push({
        number: date.getDate(),
        year: date.getFullYear(),
        month: date.getMonth(),
        day: date.getDay()
      });
      date.setDate(date.getDate() + 1);
    }
    return currentMonth;
  }

  createSecondMonth(date, month, dates) {
    if (month === 12) {
      month = 0;
    }
    const secondMonth = [];
    while (date.getMonth() === month) {
      secondMonth.push({
        number: date.getDate(),
        year: date.getFullYear(),
        month: date.getMonth(),
        day: date.getDay()
      });
      date.setDate(date.getDate() + 1);
    }
    return secondMonth;
  }

};