const express = require('express');
const bodyParser = require('body-parser');
const mustacheExpress = require('mustache-express');
const Mustache = require('mustache');
const session = require('express-session');
const path = require('path');

// Create app
const app = express();

app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'mustache');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
  secret: 'yorkie dog',
  resave: false,
  saveUninitialized: true
}));

app.get('/', function(req, res){
  console.log("in app.get");
  if (req.session.solution){
    res.redirect('./game');
  }
  else {
    res.render('index');
  }
});

app.post("/", function (req, res) {
  console.log("post");

});


app.listen(3000, function () {
  console.log('Successfully started express application!');
});
