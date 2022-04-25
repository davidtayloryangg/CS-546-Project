const home = require('./home');
const appointments = require('./appointments');
const users = require('./users');
const parks = require('./parks');
const notification = require('./notification');
const comment = require('./comments');
const img = require('./image');

const constructorMethod = (app) => {
  // app.uses go here
  app.use('/', home);
  app.use('/users', users);
  app.use('/parks', parks);
  app.use('/appointments', appointments);
  app.use('/img', img);
  // app.use('/notification', notification);

  app.all('*', (req, res) => {
    res.status(404).json('Error 404: Site path not found');
  });
};

module.exports = constructorMethod;
