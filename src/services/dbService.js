const mongoose = require("mongoose");
require("dotenv").config();

class DBService {
  constructor(connectionString) {
    this.connectionString = connectionString;
    this.connected = false;
  }

  async connect() {
    if (!this.connected) {
      await mongoose.connect(this.connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      this.connected = true;
    }
  }
}

const dbService = new DBService(process.env.MONGO_DB_URI);

module.exports = dbService;
