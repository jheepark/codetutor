let mongoose = require('mongoose');

let taskSchema = new mongoose.Schema({
  content: String
});

module.exports = mongoose.model('Task', taskSchema);
