const express = require('express');
const static = express.static(__dirname + '/public');
const configRoutes = require('./routes');
const exphbs = require('express-handlebars');

const app = express();

app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use('/public', static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(
//     session({
//       name: 'AuthCookie',
//       secret: 'some secret string!',
//       resave: false,
//       saveUninitialized: true,
//       cookie: { maxAge: 60000 }
//     }),
// );

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});