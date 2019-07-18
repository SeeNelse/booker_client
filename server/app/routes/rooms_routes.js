const HttpStatus = require('http-status-codes');

const RoomsClass = require('../classes/Rooms');
const Rooms = new RoomsClass;

const ErrorsClass = require('../classes/Errors');
const Errors = new ErrorsClass;

const ViewClass = require('../classes/View');
const View = new ViewClass;


module.exports = function(app) {

  app.get('/api/rooms/get/:format?', (request, response) => {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    let queryResult = Rooms.gerRooms();
    queryResult
      .then(ViewResult => View.getData(ViewResult, request.params.format))
      .then(result => {
        if (result.length) {
          response.status(HttpStatus.OK).send(result)
        } else {
          response.status(HttpStatus.NOT_FOUND).send(View.getData(Errors.notFound(), request.params.format))
        }
      });
  });

}