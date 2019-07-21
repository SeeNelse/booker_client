const EventsDBClass = require('../database/EventsDB');
const EventsDB = new EventsDBClass();

module.exports = class Events {

  // Запрос на получение списка ивентов в месяце
  getEventsForThisMonth(params) {
    if (
      !isNaN(+params.year) && 
      !isNaN(+params.month) &&
      params.year.length === 4 &&
      params.month.length <= 2
    ) {
      return EventsDB.getEventsForThisMonth(params);
    } else {
      return false;
    }
  }

  // Записываем новые значения в базу
  setNewEvent(data) {
    let event = JSON.parse(Object.keys(data)[0]);
    let date = event.date.split('-');
    let currentDate = {
      number: +date[2],
      year: +date[0],
      month: date[1]-1 
    }
    
    // Проверки 
    if (!event.room) {
      return false;
    }

    if (!event.date) {
      return false;
    }
 
    if (event.startTime >= event.endTime) {
      return false;
    }

    if (event.note.length > 250) {
      return false;
    }

    if (event.startTime < 300 || event.endTime > 1020) {
      return false;
    }

    if (
      event.recurrent.type === 'Weekly' && event.recurrent.countWeekly < 1 || 
      event.recurrent.type === 'Weekly' && event.recurrent.countWeekly > 4 ||
      event.recurrent.type === 'Biweekly' && event.recurrent.countBiweekly < 1 || 
      event.recurrent.type === 'Biweekly' && event.recurrent.countBiweekly > 2 ||
      event.recurrent.type === 'Monthly' && event.recurrent.countMonthly != 1
    ) {
      return false;
    }

    return EventsDB.setNewEvent(event, currentDate);
  }

  // Удаляем ивент
  deleteEvent(params) {
    return (async () => {
      let eventForCheck = await EventsDB.getCheckEventForDeleteAndEdit(params.id);
      if (+eventForCheck[0].user_id === +params.userId || +params.userRole === 1) {
        if (params.recurrent === 'true') { // приходит строка. В 3 ночи не охота с этим париться, извините пожалуйста =\
          let recurrentDays = eventForCheck[0].recurrent_id.split(',');
          recurrentDays.push(eventForCheck[0].event_id);
          let result = EventsDB.deleteEvent(recurrentDays);
          return result;
        } else {
          let result = EventsDB.deleteEvent(eventForCheck[0].event_id);
          return result;
        }
      } else {
        return false;
      }
    })()
  }

  // Обновление ивента
  updateEvent(eventId, data) {
    const waitFor = (ms) => new Promise(r => setTimeout(r, ms)); // Это потом стоит вынести в отдельный метод
    async function asyncForEach(array, callback) {
      for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
      }
    }

    let event = JSON.parse(Object.keys(data)[0]);
    return (async () => {
      let currentEvent = await EventsDB.getCheckEventForDeleteAndEdit(eventId);
      if (+currentEvent[0].user_id === +event.userId || +event.userRole === 1) {
        if (event.updateRecurrent) {
          let eventsArray = [];
          if (+currentEvent[0].recurrent_type) {
            eventsArray = await EventsDB.getEventForRecurrentEdit(+currentEvent[0].recurrent_type, true);
          } else {
            eventsArray = await EventsDB.getEventForRecurrentEdit(+currentEvent[0].event_id, true);
          }
          let timeCheckResult = true;
          let timeCheck;
          return (async () => {
            // проверка на время
            await asyncForEach(eventsArray, async (element) => {
              await waitFor(20);
              if (element.event_id >= eventId) {
                timeCheck = await EventsDB.newEventTimeCheck(event, element);
                if (!timeCheck) {
                  return timeCheckResult = false;
                }
              }
            });
            if (!timeCheckResult) {
              return false;
            }

            // Записываем новые значения
            await asyncForEach(eventsArray, async (element) => {
              await waitFor(20);
              if (element.event_id >= eventId) {
                EventsDB.setEditEvent(element, event);
              }
            });
            return true;

          })()
        } else {
          return (async () => {
            let thisElement = await EventsDB.getEventForRecurrentEdit(eventId, false);
            let timeCheck = await EventsDB.newEventTimeCheck(event, thisElement[0]);
            if (!timeCheck) {
              return false;
            }
            EventsDB.setEditEvent(thisElement[0], event);
            return true;
          })();
        }
      }
    })();
  }
}