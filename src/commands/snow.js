const {
  startSnow,
  stopSnow,
  updateSnowIntensity,
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
    default:
      message.reply(
        "Commands: '!snow start', '!snow stop', '!snow light', '!snow moderate', '!snow heavy'"
      );
      break;
  }
};

module.exports = {
  name: "snow",
  description: "Control the snowfall in the channel",
  execute,
};
