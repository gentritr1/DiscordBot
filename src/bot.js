const token =
  "MTE3ODY2MDMxNTA4MTIyODM4OA.GVE4ux.m_jwS6T-JHI4onzeO4uNLJqnc70iHJQ13h7tks"; // Replace with your bot's token

const { Client, GatewayIntentBits } = require("discord.js");

const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://gentlegen:4faQMRYofwTTMy6m@cluster0.q29osmz.mongodb.net/discordBot?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once("ready", () => {
  console.log("Logged in as " + client.user.tag);
});

client.on("messageCreate", (message) => {
  console.log("message", message.content);

  if (!message.author.bot) {
    console.log(`Message from ${message.author.tag}: ${message.content}`);
    // Additional command handling logic here
  }

  // Ignore messages from the bot itself or non-commands
  if (message.author.bot || !message.content.startsWith("!")) return;

  const command = message.content.slice(1).trim(); // Remove the '!' prefix
  if (command === "ping") {
    message.channel.send("Pong!");
  }
});

client.login(token);
