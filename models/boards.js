const mongoose = require('mongoose');

let boardSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectID,
    submitter: String,
    timestamp: true,
    givens: {type: [], required: true},
    difficulty: {type: Number, min: 0},
    techniquesUsed: [String],
    timesPlayed: {type: Number, default: 0},
    timesSolved: {type: Number, default: 0},
    averageSolveTime: Number
  });


module.exports = mongoose.model('boards', boardSchema);
