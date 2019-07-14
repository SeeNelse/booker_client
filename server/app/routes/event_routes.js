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
    let queryResult = Events.getEventsForThisMonth(request.params);
    queryResult
      .then(ViewResult => View.getData(ViewResult, request.params.format))
      .then(result => {
        if (result.length) {
          response.status(HttpStatus.OK).send(result)
        } else {
          response.status(HttpStatus.NOT_FOUND).send(View.getData(Errors.nomFound(), request.params.format))
        }
      });
    
  });

  // Записываем новые значения в базу
  app.post('/api/event/new', (request, response) => {
    console.log('*****************************************************************');
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    let queryNewEvent = Events.setNewEvent(request.body);
    // console.log(queryNewEvent);// Проверка если пришел false, тру не будет, т.к. приходит только промис
    queryNewEvent.then(result => {
      console.log(result);
      // if (result) {
        // response.status(HttpStatus.OK).send(result);
      // } else {
        // response.status(HttpStatus.NOT_ACCEPTABLE).send(View.getData(Errors.nomFound(), request.params.format));
      // }
    });
  });

  // Запись нового ивента в базу
  // app.post('/api/event/new', (req, res) => {
  //   console.log(123123);
  //   res.header("Access-Control-Allow-Origin", "*");
  //   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  //   let query = 'SELECT * FROM `booker_event`';
  //   let queryArg = '';
  //   mysqlConnect(query, queryArg)
  //   .then((request) => {
  //     console.log(request);
  //     res.send(request)
  //   })
  //   .catch((error) => {
  //     console.log('Error in the Query', error);
  //   });
  // });



  // апдейт
  // app.put('/event/:id', (req, res) => {
  //   res.header("Access-Control-Allow-Origin", "*");
  //   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  //   console.log(req.params.id);
  //   mysqlServer.query(
  //     'UPDATE `test` SET '+req.params.id,
  //     function (error, results, fields) {
  //       res.send(results);
  //       mysqlServer.end();
  //     }
  //   );
  // });


  app.get('/*?', (req, res) => {
    console.log(req);
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.send('404');
  });
};
