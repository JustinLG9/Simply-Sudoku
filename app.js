//-------------------------- Server/Routing setup --------------------------//
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

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

// error handler
app.use(function(req, res, next) {
  res.status(404);
  res.render('404');
});




//-------------------------- Firestore Database --------------------------//
/*const admin = require('firebase-admin');

let serviceAccount = require('C:\\Users\\justi\\Simple_Sudoku\\simplesudoku-ef96b-bff0a03eb9b2.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

let db = admin.firestore();

function addBoardToDB(board) {
  let docRef = db.collection('boards').doc().id;

  docRef.set({
    submitter: board.submitter,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
    givens: board.givens,
    difficulty: board.difficulty,
    techniquesUsed: board.techniquesUsed,
    timesPlayed: 0,
    timesSolved: 0
  }).then(() => {
    console.log('Added document with _id: ' + docRef);
  })
  .catch(error => {
    console.log('Error uploading documents');
    throw new Error('Error: Uploading document:');
  });
};

function getRandomBoardFromDB() {
  var boards = db.collection("boards");

  var key = boards.doc().id;

  boards.where(admin.firestore.FieldPath.documentId(), '>=', key).limit(1).get()
  .then(snapshot => {
      if(snapshot.size > 0) {
          snapshot.forEach(doc => {
              console.log(doc.id, '=>', doc.data());
          });
      }
      else {
          var board = boards.where(admin.firestore.FieldPath.documentId(), '<', key).limit(1).get()
          .then(snapshot => {
              snapshot.forEach(doc => {
                  console.log(doc.id, '=>', doc.data());
              });
          })
          .catch(err => {
              console.log('Error getting documents', err);
          });
      }
  })
  .catch(err => {
      console.log('Error getting documents', err);
  });
};

*/


//-------------------------- Sudoku Functions --------------------------//
const totalCells = 81;
const boardLength = Math.sqrt(totalCells); // 9
const cellLength = Math.sqrt(boardLength); // 3

let cellValues = [];
cellValues.length = totalCells;
cellValues.fill(0);




module.exports = app;
