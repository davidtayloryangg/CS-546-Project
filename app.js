const express = require('express');
const static = express.static(__dirname + '/public');
const configRoutes = require('./routes');
const exphbs = require('express-handlebars');

const handlebarsInstance = exphbs.create({
  defaultLayout: 'main',
  // Specify helpers which are only registered on this instance.
  helpers: {
    asJSON: (obj, spacing) => {
      if (typeof spacing === 'number')
        return new Handlebars.SafeString(JSON.stringify(obj, null, spacing));

      return new Handlebars.SafeString(JSON.stringify(obj));
    }
  },
  partialsDir: ['views/partials/']
});

const app = express();

app.engine('handlebars', handlebarsInstance.engine);
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

console.log(new Date());
app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});