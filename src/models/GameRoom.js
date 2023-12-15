// models/GameRoom.js
const mongoose = require("mongoose");

const gameRoomSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  participants: [
    {
      userId: String,
      username: String,
    },
  ],
  createdAt: { type: Date, default: Date.now },
  currentRound: { type: Number, default: 0 },
});

module.exports = mongoose.model("GameRoom", gameRoomSchema);
