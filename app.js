const express = require('express');
const bodyParser = require('body-parser');
const mustacheExpress = require('mustache-express');
const Mustache = require('mustache');
const session = require('express-session');
const path = require('path');
const fs = require('fs');

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

const words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");


function setGame(req, res) {
  if (!req.session.solution) {
    req.session.solution = words[Math.floor(Math.random() * words.length)];
    req.session.used_letters = [];
    req.session.guesses_left = 8;
    }
    console.log(req.session.solution);
    req.session.solution_letters = [... req.session.solution];
    req.session.board_array = [];
      for (i = 0; i < req.session.solution_letters.length; i++) {
        req.session.board_array.push("_ ");
      }
  console.log(req.session.board_array);
  console.log(req.session.guesses_left);
  res.render("board", req.session);
  console.log(req.session);
}

function playGame(req, res) {
  for (i = 0; i < req.session.solution_letters.length; i++ ){
    if (req.session.letter === req.session.solution_letters[i]) {
      req.session.board_array[i] = req.session.letter;
      req.session.used_letters.push(req.session.letter);
    } // if stmt
    else {
      req.session.guesses_left = req.session.guesses_left-1;
      if (req.session.guesses_left = 0) {
        res.redirect('./complete');
      }
    } //else
  } // for loop
  res.render("board", req.session);
}

app.get('/', function(req, res){
  console.log("in app.get");
  if (req.session.solution){
    setGame(req, res);
  }
  else {
    res.render('index');
  }
});

app.post("/", function (req, res) {
  console.log("post");
  setGame(req, res);
});

app.post("/board", function (req, res) {
  console.log("post board");
  req.session.letter = req.body.letter;
  playGame(req, res);
});

app.listen(3000, function () {
  console.log('Successfully started express application!');
});
