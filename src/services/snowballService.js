const SnowballStats = require("../models/SnowballStats");
const GameRoom = require("../models/GameRoom");
const dbService = require("../config/databaseConfig"); // Import the database configuration

class SnowballService {
  async joinSnowballFight(userId, username) {
    await dbService.connect();

    let stats = await SnowballStats.findOne({ userId });
    if (!stats) {
      stats = new SnowballStats({
        userId,
        username,
        wins: 0,
        losses: 0,
        hits: 0,
        throws: 0,
        winStreak: 0,
        accuracy: 0,
      });
      await stats.save();
      return true; // New user joined
    }
    return false; // Existing user
  }

  async createGameRoom(roomId) {
    await dbService.connect();

    const newRoom = new GameRoom({ roomId, participants: [] });
    await newRoom.save();
    return roomId;
  }

  async isParticipantInRoom(roomId, userId) {
    await dbService.connect();

    const gameRoom = await GameRoom.findOne({ roomId });
    return gameRoom
      ? gameRoom.participants.some((p) => p.userId === userId)
      : false;
  }

  async updateGameRoomRound(roomId, roundIncrement) {
    await dbService.connect();

    const gameRoom = await GameRoom.findOne({ roomId });
    if (gameRoom) {
      gameRoom.currentRound += roundIncrement;
      await gameRoom.save();
    }
  }

  async updateGameStats(userId, didHit, didWin) {
    await dbService.connect();

    const stats = await SnowballStats.findOne({ userId });
    if (stats) {
      stats.throws += 1;
      if (didHit) stats.hits += 1;
      if (didWin !== null) {
        if (didWin) {
          stats.wins += 1;
          stats.winStreak += 1;
        } else {
          stats.losses += 1;
          stats.winStreak = 0; // Reset win streak on loss
        }
      }
      stats.accuracy = (stats.hits / stats.throws) * 100;
      await stats.save();
    } else {
      // Create new stats if not exist
      const newStats = new SnowballStats({
        userId: userId,
        wins: didWin ? 1 : 0,
        losses: didWin === false ? 1 : 0,
        hits: didHit ? 1 : 0,
        throws: 1,
        winStreak: didWin ? 1 : 0,
        accuracy: didHit ? 100 : 0,
      });
      await newStats.save();
    }
  }

  async getAllParticipantsStats(roomId) {
    await dbService.connect();
    const gameRoom = await GameRoom.findOne({ roomId }).populate(
      "participantsStats"
    );
    return gameRoom ? gameRoom.participantsStats : [];
  }

  async getGameRoomCurrentRound(roomId) {
    await dbService.connect();

    const gameRoom = await GameRoom.findOne({ roomId });
    return gameRoom ? gameRoom.currentRound : 0;
  }

  async addParticipantToRoom(roomId, userId, username) {
    await dbService.connect();

    const room = await GameRoom.findOne({ roomId });
    if (room && !room.participants.some((p) => p.userId === userId)) {
      room.participants.push({ userId, username });
      await room.save();
    }
  }

  async getParticipant(roomId, username) {
    await dbService.connect();

    const gameRoom = await GameRoom.findOne({ roomId });
    if (gameRoom) {
      return gameRoom.participants.find((p) => p.username === username) || null;
    }
    return null;
  }

  async removeParticipantFromRoom(roomId, userId) {
    await dbService.connect();

    const room = await GameRoom.findOne({ roomId });
    if (room) {
      room.participants = room.participants.filter((p) => p.userId !== userId);
      await room.save();
      return room.participants.length; // Return remaining participant count
    }
    return 0;
  }

  async leaveSnowballFight(userId) {
    await dbService.connect();
    const stats = await SnowballStats.findOne({ userId });
    if (stats) {
      stats.lastPlayed = new Date();
      await stats.save();
      return true;
    }
    return false;
  }

  async recordThrow(userId, hit) {
    await dbService.connect();

    const stats = await SnowballStats.findOne({ userId });
    if (stats) {
      stats.throws++;
      if (hit) stats.hits++;
      stats.accuracy = (stats.hits / stats.throws).toFixed(2);
      await stats.save();
    }
  }
}

module.exports = new SnowballService();
