const eventRoutes = require('./event_routes');
const roomsRoutes = require('./rooms_routes');
const authRoutes = require('./auth_routes');

module.exports = function(app) {
  authRoutes(app);
  roomsRoutes(app);
  eventRoutes(app);
};