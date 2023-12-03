const MongoDBService = require("../services/dbServices/MongoDBService");
const SQLService = require("../services/dbServices/SQLService");
require("dotenv").config();

let dbService;
const dbType = "MongoDB";

switch (dbType) {
  case "MongoDB":
    dbService = new MongoDBService(process.env.MONGO_DB_URI);
    break;
  case "SQL":
  // dbService = new SQLService(sqlConnectionString);
  default:
    break;
}

module.exports = dbService;
