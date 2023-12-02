const Discord = require("discord.js");
const fs = require("fs");
const connectMongoDB = require("./utils/mongoConnection");
const getRandomMessage = require("./utils/getRandomMessage");

require("dotenv").config();

const client = new Discord.Client({
  intents: [
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.MessageContent,
  ],
});
client.commands = new Map();

const commandFiles = fs
  .readdirSync("./src/commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.once("ready", () => {
  console.log("Ready!");
});

client.on("messageCreate", (message) => {
  if (!message.content.startsWith("!") || message.author.bot) return;

  const args = message.content.slice(1).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);

  if (!client.commands.has(commandName)) {
    const mafiaMessage = getRandomMessage("mafia");
    message.reply(mafiaMessage);
    return;
  }

  try {
    command.execute(message, args, connectMongoDB);
  } catch (error) {
    console.error(error);
    message.reply("There was an error executing that command.");
  }
});

client.login(process.env.DISCORD_TOKEN);
