module.exports = class CalendarMonths {

  getCalendar(year, month) {
    let date = new Date(year, month);
    let currentMonth = this.createThreeMonths(date, month);
    let secondMonth = this.createThreeMonths(date, month+1);
    let thirtyMonth = this.createThreeMonths(date, month+2, true);
    let dates = [...currentMonth, ...secondMonth, ...thirtyMonth];
    return dates;
  }

  // Генерация первых двух полных месяцев и 5 дней третьего
  createThreeMonths(date, month, thirty = false) {
    let currentMonth = [];
    if (month === 12) {
      month = 0;
    } else if (month === 13) {
      month = 1;
    }
    while (date.getMonth() === month) {
      if (date.getDate() === 6 && thirty) {
        return currentMonth;
      }
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


};