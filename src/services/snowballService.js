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

  async updateGameStats(userId, didHit) {
    await dbService.connect();

    const stats = await SnowballStats.findOne({ userId });
    if (stats) {
      stats.throws += 1;
      if (didHit) {
        stats.hits += 1; // Increment hits
      }
      await stats.save();
    } else {
      // Create new stats record if it doesn't exist
      const newStats = new SnowballStats({
        userId: userId,
        hits: didHit ? 1 : 0,
        throws: 1,
        // ... other default values ...
      });
      await newStats.save();
    }
  }

  async getAllParticipantsStats(roomId) {
    await dbService.connect();
    const gameRoom = await GameRoom.findOne({ roomId });
    if (!gameRoom) {
      return [];
    }

    const statsPromises = gameRoom.participants.map(async (participant) => {
      const stats = await SnowballStats.findOne({ userId: participant.userId });
      if (stats) {
        return { username: participant.username, ...stats.toObject() };
      } else {
        // Return a default object for participants with no stats
        return { username: participant.username, hits: 0 };
      }
    });

    return await Promise.all(statsPromises);
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

  async updateRound(roomId, roundIncrement) {
    await dbService.connect();

    const gameRoom = await GameRoom.findOne({ roomId });
    if (gameRoom) {
      gameRoom.currentRound += roundIncrement;
      await gameRoom.save();
    }
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
