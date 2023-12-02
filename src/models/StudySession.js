const mongoose = require("mongoose");

const studySessionSchema = new mongoose.Schema({
  userId: String,
  studyStart: Date,
  studyEnd: Date,
});

module.exports = mongoose.model("StudySession", studySessionSchema);
