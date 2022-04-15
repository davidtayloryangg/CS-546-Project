const home = require('./home');
const appointments = require('./appointments');
const signup = require('./signup');
const login = require('./login');
const logout = require('./logout');
const users = require('./users');
const parks = require('./parks');
const notification = require('./notification');
const comment = require('./comment');

const constructorMethod = (app) => {
  // app.uses go here
  app.use('/', home);
  // app.use('/signup', signup);
  // app.use('/login', login);
  // app.use('/logout', logout);
  // app.use('/users', users);
  // app.use('/parks', parks);
  // app.use('/appointments', appointments);
  // app.use('/notification', notification);
  
  app.all('*', (req, res) => {
    res.status(404).json('Error 404: Site path not found');
  });
};

module.exports = constructorMethod;
