const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 9008;
const routes = require('./app/routes/index');
const cors = require('cors');
// const moment = require('moment-timezone');
// moment.tz.setDefault('UTC');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
routes(app);

app.listen(port);