const mysqlConnect = require('../libs/mysqlQuery');

module.exports = function(app) {

  // чтение
  app.get('/api/notes/:id/:format?', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    let query = 'SELECT * FROM `showroom_brand` WHERE id =';
    let queryArg = req.params.id;
    mysqlConnect(query, queryArg)
    .then((request) => {
      res.send(request)
    })
    .catch((error) => {
      console.log('Error in the Query', error);
    });
  });


  // запись
  app.post('/api/notes/', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    mysqlServer.query(
      'INSERT INTO `test` SET ?',
      req.body,
      function (error, results, fields) {
        res.send(results);
        // mysqlServer.end();
      }
    );
  });


  // апдейт
  // app.put('/notes/:id', (req, res) => {
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
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.send('404');
  });
};
