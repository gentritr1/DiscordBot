const {
  startSnow,
  stopSnow,
  updateSnowIntensity,
  updateSnowTheme,
  leaveSnowballFight,
  joinSnowballFight,
  throwSnowballMultiplayer,
  throwSnowballSolo,
} = require("../utils/snowManager");

const execute = async (message, args) => {
  const command = args[0]?.toLowerCase();

  switch (command) {
    case "start":
      startSnow(message);
      break;
    case "stop":
      stopSnow(message);
      break;
    case "light":
    case "moderate":
    case "heavy":
      updateSnowIntensity(message, command);
      break;
    case "join":
      joinSnowballFight(message, message.author);
      break;
    case "leave":
      leaveSnowballFight(message.author, message.channel);
      break;
    case "throw":
      const targetUsername = args[1];
      if (targetUsername) {
        // Multiplayer mode: Player specified a target user
        await throwSnowballMultiplayer(message, message.author, targetUsername);
      } else {
        // Solo mode: No target user specified
        await throwSnowballSolo(message, message.author);
      }
      break;
    case "theme":
      const theme = args[1]?.toLowerCase();
      if (theme) {
        updateSnowTheme(message, theme);
      } else {
        message.reply(
          "Please specify a theme. Available themes: " +
            Object.keys(snowThemes).join(", ")
        );
      }
      break;
    default:
      message.reply(
        "Commands: start, stop, light, moderate, heavy, theme [themeName], '"
      );
      break;
  }
};

module.exports = {
  name: "snow",
  description: "Control the snowfall in the channel",
  execute,
};
