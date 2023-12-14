const SnowballStats = require("../models/SnowballStats");
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

  // Additional methods for leaving the game, updating stats, etc.
}

module.exports = new SnowballService();
