const express        = require('express');
const bodyParser     = require('body-parser');
const app            = express();
const port           = 9003;
const routes = require('./app/routes');
const cors = require('cors')

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
routes(app);

app.listen(port);
