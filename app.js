//-------------------------- Server/Routing setup --------------------------//
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');

const Board = require('models\\boards.js')

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
app.listen(port);

//-------------------------- Routing --------------------------//
app.get('/', function(req, res, next) {
  res.render('index');
});

app.post('/', function(req, res, next) {
  const board = new Board({
    _id: new mongoose.Types.ObjectId(),
    submitter: req.body.submitter,
    givens: req.body.givens,
    difficulty: req.body.difficulty,
    techniquesUsed: req.body.techniquesUsed,
    timesPlayed: req.body.timesPlayed,
    timesSolved: req.body.timesSolved,
    averageSolveTime: req.body.averageSolveTime
  })
  board
    .save()
    .then(result => {
      console.log(result);
  })
  .catch(err => console.log(err));
});

// error handler
app.use(function(req, res, next) {
  res.status(404);
  res.render('404');
});




//-------------------------- MongoDB Database --------------------------//
mongoose.connect('mongodb://heroku_71p4v3xk:lrtfthd5hehh6ckqrkkof3pa64@ds239797.mlab.com:39797/heroku_71p4v3xk');

let db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

db.once('open', function callback() {



})


//-------------------------- Sudoku Functions --------------------------//
const totalCells = 81;
const boardLength = Math.sqrt(totalCells); // 9
const cellLength = Math.sqrt(boardLength); // 3

let cellValues = getRandomBoardFromDB();




module.exports = app;
