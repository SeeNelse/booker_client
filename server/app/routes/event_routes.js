const HttpStatus = require('http-status-codes');

const EventsClass = require('../classes/Events');
const Events = new EventsClass;

const ErrorsClass = require('../classes/Errors');
const Errors = new ErrorsClass;

const ViewClass = require('../classes/View');
const View = new ViewClass;


module.exports = function(app) {
  // Запрос на получение списка ивентов в месяце
  app.get('/api/event/:year/:month/:format?', (request, response) => {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    let getEvents = Events.getEventsForThisMonth(request.params);
    getEvents
      .then(ViewResult => View.getData(ViewResult, request.params.format))
      .then(result => {
        if (result.length) {
          response.status(HttpStatus.OK).send(result)
        } else {
          response.status(HttpStatus.NOT_FOUND).send(View.getData(Errors.notFound(), request.params.format))
        }
      });
    
  });

  // Записываем новые значения в базу
  app.post('/api/event/new/:format?', (request, response) => { 
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    let newEvent = Events.setNewEvent(request.body);
    if (newEvent === undefined || newEvent === false) {
      response.status(HttpStatus.NOT_ACCEPTABLE).send(View.getData(Errors.notFound(), request.params.format));
      return false;
    } 
    newEvent
    .then(ViewResult => View.getData(ViewResult, request.params.format))
    .then(result => {
      if (result) {
        response.status(HttpStatus.OK).send(result);
      } else {
        response.status(HttpStatus.NOT_ACCEPTABLE).send(View.getData(Errors.notFound(), request.params.format));
      }
    });
  });


  // Удаление ивента
  app.delete('/api/event/delete/:id/:userId/:userRole/:recurrent/:format?', (request, response) => {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    let deleteEvent = Events.deleteEvent(request.params);
    if (deleteEvent === undefined || deleteEvent === false) {
      response.status(HttpStatus.NOT_ACCEPTABLE).send(View.getData(Errors.notFound(), request.params.format));
      return false;
    }
    deleteEvent
      .then(ViewResult => View.getData(ViewResult, request.params.format))
      .then(result => {
        if (result) {
          response.status(HttpStatus.OK).send(result);
        } else {
          response.status(HttpStatus.NOT_ACCEPTABLE).send(View.getData(Errors.notFound(), request.params.format));
        }
      });
  });

  // Апдейт ивента
  app.put('/api/event/edit/:id/:format?', (request, response) => {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    updateEvent = Events.updateEvent(request.params.id, request.body);
    if (updateEvent === undefined || updateEvent === false) {
      response.status(HttpStatus.NOT_ACCEPTABLE).send(View.getData(Errors.notFound(), request.params.format));
      return false;
    }
    updateEvent
      .then(ViewResult => View.getData(ViewResult, request.params.format))
      .then(result => {
        if (result) {
          response.status(HttpStatus.OK).send(result);
        } else {
          response.status(HttpStatus.NOT_ACCEPTABLE).send(View.getData(Errors.notFound(), request.params.format));
        }
      });


  });


  app.get('/:format?', (request, response) => {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    response.status(HttpStatus.NOT_ACCEPTABLE).send(View.getData(Errors.notFound(), request.params.format))
  });
};
