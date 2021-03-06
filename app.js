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
    req.session.message = "";
    console.log(req.session.solution);
    req.session.solution_letters = [... req.session.solution];
    req.session.board_array = [];
      for (i = 0; i < req.session.solution_letters.length; i++) {
        req.session.board_array.push("_ ");
      }
    }
  console.log(req.session.board_array);
  console.log(req.session.guesses_left);
  res.render("board", req.session);
  console.log(req.session);
} // end setGame

// function gameComplete(req, res) {
//   res.render('complete', req.session);
// } // end gameComplete

function playGame(req, res) {
  let found = false;
  let used = false;
  req.session.letter = req.session.letter.toLowerCase();
  for (j = 0; j < req.session.solution_letters.length; j++ ){
    if (req.session.letter === req.session.used_letters[j]){
      req.session.message = "You've already used that letter, please try again";
      used = true;
    }
  }
    if (!used) {
      for (i = 0; i < req.session.solution_letters.length; i++ ){
        if (req.session.letter === req.session.solution_letters[i]) {
          req.session.board_array[i] = req.session.letter;
          found = true;
          req.session.message = "You found a match!";
        } // if [i] stmt
    } // for i loop
    req.session.used_letters.push(req.session.letter);
  } // if !used
    if (!found && !used) {
      // req.session.used_letters.push(req.session.letter);
      req.session.guesses_left = req.session.guesses_left-1;
      console.log(req.session.guesses_left);
      req.session.message = "Sorry, no match";

      }
} // end playGame

app.get('/', function(req, res){
  console.log("in app.get");
  if (req.session.solution){
    setGame(req, res);
  }
  else {
    res.render('index');
  }
});

app.get('/complete', function(req, res){
  console.log("in app.get complete");
  res.render('complete', req.session);
});

app.post("/", function (req, res) {
  console.log("root post");
  setGame(req, res);
});

app.post("/board", function (req, res) {
  console.log("post board");
  req.session.letter = req.body.letter;
  playGame(req, res);
  if (JSON.stringify(req.session.board_array) == JSON.stringify(req.session.solution_letters)) {
    req.session.win = true;
    console.log("winner!");
    res.redirect('/complete');
    // res.render('complete', req.session);
  }
  else if (req.session.guesses_left == 0) {
      req.session.win = false;
      console.log('loser');
      res.redirect('/complete');
      // res.render('complete', req.session);
      }
  else {
    console.log("render board");
    res.render("board", req.session);
  }
});

app.post('/complete', function(req,res){
  console.log("in app.post complete");
  req.session.solution = "";
  console.log(req.session.solution);
  setGame(req, res);
  res.redirect('/board');
})

app.listen(3000, function () {
  console.log('Successfully started express application!');
});
