require("dotenv").config();

module.exports = {
  discordToken: process.env.DISCORD_BOT_TOKEN,
  mongoUri: process.env.MONGO_URI,
};
