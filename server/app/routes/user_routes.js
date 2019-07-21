const HttpStatus = require('http-status-codes');

const UserClass = require('../classes/User');
const User = new UserClass;

const ErrorsClass = require('../classes/Errors');
const Errors = new ErrorsClass;

const ViewClass = require('../classes/View');
const View = new ViewClass;

module.exports = function(app) {

  app.get('/api/user/list/:format?', (request, response) => {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    let result = User.getUsers();
    result
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