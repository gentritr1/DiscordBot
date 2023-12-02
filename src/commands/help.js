const fs = require("fs");
const { sendRandomizedResponse } = require("../utils/responseUtils");

const execute = (message) => {
  const commandFiles = fs
    .readdirSync("./src/commands")
    .filter((file) => file.endsWith(".js"));

  let helpMessage = "Available Commands:\n";
  for (const file of commandFiles) {
    const command = require(`./${file}`);
    helpMessage += `!${command.name} - ${command.description}\n`;
  }

  sendRandomizedResponse(message, helpMessage);
};

module.exports = {
  name: "help",
  description: "Show a list of all commands",
  execute,
};
