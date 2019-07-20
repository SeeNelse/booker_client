const express = require('express');

const app = express();
const port = 8000;
const routes = require('./app/routes/index');
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

routes(app);

app.listen(port);