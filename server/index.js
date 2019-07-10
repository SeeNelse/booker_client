const express        = require('express');
const bodyParser     = require('body-parser');
const app            = express();
const port           = 8000;
const routes = require('./app/routes');



// mysqlServer.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected!");
// });

app.use(bodyParser.urlencoded({ extended: true }));
routes(app);

app.listen(port, () => {
  console.log('We are live on ' + port);
});
