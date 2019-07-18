const eventRoutes = require('./event_routes');
const roomsRoutes = require('./rooms_routes');

module.exports = function(app) {
  roomsRoutes(app);
  eventRoutes(app);
};