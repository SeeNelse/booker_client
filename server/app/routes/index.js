const noteRoutes = require('./event_routes');

module.exports = function(app) {
  noteRoutes(app);
  // Тут, позже, будут и другие обработчики маршрутов 
};