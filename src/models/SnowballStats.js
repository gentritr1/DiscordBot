// models/SnowballStats.js
const mongoose = require("mongoose");

const snowballStatsSchema = new mongoose.Schema({
  userId: String,
  username: String,
  wins: { type: Number, default: 0 },
  losses: { type: Number, default: 0 },
  hits: { type: Number, default: 0 },
  throws: { type: Number, default: 0 },
  winStreak: { type: Number, default: 0 },
  accuracy: { type: Number, default: 0 },
});

module.exports = mongoose.model("SnowballStats", snowballStatsSchema);
