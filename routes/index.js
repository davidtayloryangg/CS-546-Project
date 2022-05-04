const home = require('./home');
const users = require('./users');
const appointments = require('./appointments');
const notification = require('./notification');
const parks = require('./parks');
const activities = require('./activities');
const comment = require('./comments');

const constructorMethod = (app) => {
  // app.uses go here
  app.use('/', home);
  app.use('/users', users);
  app.use('/parks', parks);
  app.use('/appointments', appointments);
  app.use('/parks/activities', activities);
  app.use('/parks/activities/management', activities);
  // app.use('/notification', notification);

  app.all('*', (req, res) => {
    res.status(404).json('Error 404: ');
  });
};

module.exports = constructorMethod;
