const mongoose = require("mongoose");
const IDatabaseService = require("./IDatabaseService");

class MongoDBService extends IDatabaseService {
  constructor(connectionString) {
    super();
    this.connectionString = connectionString;
    this.connected = false;
  }

  async connect() {
    if (!this.connected) {
      await mongoose.connect(this.connectionString);
      this.connected = true;
    }
  }
}

module.exports = MongoDBService;
