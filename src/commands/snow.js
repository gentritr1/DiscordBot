const {
  startSnow,
  stopSnow,
  updateSnowIntensity,
  updateSnowTheme,
  throwSnowball,
  leaveSnowballFight,
  joinSnowballFight,
} = require("../utils/snowManager");

const execute = (message, args) => {
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
      throwSnowball(message, message.author, args[1]);
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
