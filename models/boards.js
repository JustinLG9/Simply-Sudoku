const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let boardSchema = Schema({
    _id: Schema.Types.ObjectID,
    submitter: String,
    givens: {type: [], required: true},
    solution: [],
    difficulty: {type: Number, min: 0},
    techniquesUsed: [String],
    timesPlayed: {type: Number, default: 0},
    timesSolved: {type: Number, default: 0},
    averageSolveTime: Number
  }, {timestamps: true});


module.exports = mongoose.model('boards', boardSchema);
