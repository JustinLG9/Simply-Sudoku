//-------------------------- Server/Routing setup --------------------------//
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
var bodyParser = require('body-parser')
const logger = require('morgan');
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://JustinLG:' + process.env.MONGO_ATLAS_PSW + '@simplysudoku-lxviz.mongodb.net/simplySudoku?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true })
  .then( console.log('Connection to MongoDB database successful'))
  .catch(error => console.log(error));
mongoose.connection.on('error', err => { console.log(err) });

const Board = require(path.join(__dirname, 'models/boards.js'));

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

let port = process.env.PORT || 8000;
app.listen(port);

//-------------------------- Routing --------------------------//
app.get('/', function(req, res, next) {
  res.render('index');
});

app.get('/randomBoard', function(req, res) {
  Board.aggregate([
    { $sample: { size: 1 } }
  ], function(err, result) {
    res.status(200).json(result[0]);
  });
});

app.post('/uniqueSolution', function(req, res) {
  let grid = req.body.sudoku;
  grid.forEach(function(value, index) {
    grid[index] = Number(grid[index]);
  });
  if (sudokuInvalidCells(grid).length) {
    let [numSolutions, solutions] = solveSudoku(grid, findLastUnassignedLocation(grid));
    let board = '';
    if (numSolutions == 1) {
      board = new Board({
        _id: new mongoose.Types.ObjectId(),
        submitter: '',
        givens: grid,
        solution: solutions[0],
        difficulty: 0,
        techniquesUsed: [],
        timesPlayed: 1,
        timesSolved: 0,
        averageSolveTime: 0
      })
      board
        .save()
        .then(result => {
          console.log(result);
        })
        .catch(err => {
          console.log(err);
          res.status(200).json({error: err});
        });
    }
    res.status(200).json({
      numSolutions: numSolutions,
      solutions: solutions,
      board: board
    })
  } else {
    res.status(200).json({
      invalidCells: sudokuInvalidCells(grid)
    })
  }
});

app.get('/:board', function(req, res, next) {
  const id = req.params.board;
  Board.findById(id)
    .exec()
    .then(doc => {
      console.log(doc);
      cellValues = doc.givens;
      res.status(200).json(cellValues);
    })
    .catch(err => {
      console.log(err);
      res.status(404).render('404');
    })
});

// error handler
app.use(function(req, res, next) {
  res.status(404).render('404');
});



//-------------------------- Sudoku Functions --------------------------//
const totalCells = 81;
const boardLength = Math.sqrt(totalCells); // 9
const blockLength = Math.sqrt(boardLength); // 3

function solveSudoku(grid, lastUnassignedLocation, index = 0, numSolutions = 0, solutions = []) {
  const maxSolutions = 50;
  index = findUnassignedLocation(grid, index);

  for (let num = 1; num <= boardLength; num++) {

    if (numSolutions == maxSolutions)
      return [numSolutions, solutions];

    if ( noConflicts(grid, index, num) ) {   
        grid[index] = num;

        if (index == lastUnassignedLocation) {
          solutions.push([]);
          for (i = 0; i < totalCells; i++) {
            solutions[numSolutions].push(Number(grid[i]));
          }
          numSolutions++;
        } else
          [numSolutions, solutions] = solveSudoku(grid, lastUnassignedLocation, index, numSolutions, solutions);

        // mark cell as empty (with 0)    
        grid[index] = 0;
    }
  }

  return [numSolutions, solutions];
}

function findUnassignedLocation(grid, index) {
  var ind = -1;

  while (true) {
      if (index == totalCells) {
          return ind;
      } else {
          if (grid[index] == 0) {
              ind = index;
              return ind;
          } else {
              index++;
          }
      }
  }
}

function findLastUnassignedLocation(grid) {
  var index = totalCells - 1;

  while (true) {
    if (index == -1)
      return index;
    else {
      if (grid[index] == 0)
        return index;
      else
        index--;
    }
  }
}

function sudokuInvalidCells(grid) {
  let invalidCells = [];

  grid.forEach(function(value, index) {
    if (!noConflicts(grid, index, value))
      invalidCells.push(index);
  })

  return invalidCells;
}

function noConflicts(grid, index, num) {
  return isRowOk(grid, index, num) && isColOk(grid, index, num) && isBoxOk(grid, index, num);
}

function isRowOk(grid, index, num) {
  index = Math.floor(index / boardLength) * boardLength;
  for (var itr = 0; itr < boardLength; itr++)
      if (grid[index + itr] == num)
          return false;

  return true;
}
function isColOk(grid, index, num) {
  index = index % boardLength;
  for (var itr = 0; itr < boardLength; itr++)
  if (grid[index + itr * boardLength] == num)
      return false;

  return true;    
}
function isBoxOk(grid, index, num) {
  const row = Math.floor(Math.floor(index / boardLength) / blockLength) * blockLength * boardLength;
  const col = Math.floor(index % boardLength / blockLength) * blockLength;
  index = row + col;

  for (var r = 0; r < blockLength; r++)
      for (var c = 0; c < blockLength; c++)
          if (grid[index + c + r * 9] == num)
              return false;

  return true;
}


module.exports = app;
