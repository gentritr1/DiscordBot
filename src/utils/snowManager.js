let snowInterval = null;
let awaitingResponse = false;
let responseCheckInterval = null;

const snowIntensities = {
  light: { interval: 30000, flakes: 5 }, // 1 minute, 5 flakes
  moderate: { interval: 15000, flakes: 10 }, // 30 seconds, 10 flakes
  heavy: { interval: 2500, flakes: 20 }, // 10 seconds, 15 flakes
};

let currentIntensity = "moderate";

const updateSnowIntensity = (message, intensity) => {
  if (!snowIntensities[intensity]) {
    message.reply(
      "Invalid intensity level. Please choose 'light', 'moderate', or 'heavy'."
    );
    return;
  }

  currentIntensity = intensity;

  if (snowInterval) {
    clearInterval(snowInterval); // Clear existing snow interval
    snowInterval = null; // Reset the interval variable
    startSnowfall(message); // Restart with new intensity
    message.reply(`Snow intensity updated to ${intensity}.`);
  } else {
    message.reply(
      "Snow is not falling. Use '!snow start' to start with the new intensity."
    );
  }
};

const startSnowfall = (message) => {
  snowInterval = setInterval(() => {
    if (!awaitingResponse) {
      const snowLine = createSnowLine();
      message.channel.send(snowLine);
    }
  }, snowIntensities[currentIntensity].interval);

  if (!responseCheckInterval) {
    responseCheckInterval = setInterval(() => {
      checkUserResponse(message);
    }, 60000); // Check user response every minute
  }
};

const startSnow = (message) => {
  if (snowInterval) {
    message.reply("Snow is already falling!");
    return;
  }

  message.reply("Let it snow! ❄️");
  startSnowfall(message);
};

const stopSnow = (message) => {
  if (!snowInterval) {
    message.reply("It's not snowing right now.");
    return;
  }

  clearInterval(snowInterval);
  clearInterval(responseCheckInterval);
  snowInterval = null;
  responseCheckInterval = null;
  awaitingResponse = false;
  message.reply("Snow stopped. ☃️");
};

const createSnowLine = () => {
  const { flakes } = snowIntensities[currentIntensity];
  const snowflakes = ["❄️", "☃️", "⛄", "🌨️", "🎿", "⛷", "🏂"]; // More emojis for variety
  let snowLine = "";
  for (let i = 0; i < flakes; i++) {
    snowLine += snowflakes[Math.floor(Math.random() * snowflakes.length)] + " ";
  }
  return snowLine;
};

const checkUserResponse = (message) => {
  if (awaitingResponse) return;
  awaitingResponse = true;

  message.channel
    .send("Are you still watching? Reply 'yes' to continue the snow! ⏳")
    .then(() => {
      const filter = (response) =>
        response.author.id === message.author.id &&
        response.content.toLowerCase() === "yes";
      const collector = message.channel.createMessageCollector({
        filter,
        time: 10000,
      });

      collector.on("collect", () => {
        awaitingResponse = false;
        collector.stop();
      });

      collector.on("end", (collected, reason) => {
        if (reason !== "time") return;
        clearInterval(snowInterval);
        snowInterval = null;
        awaitingResponse = false;
        message.channel.send("No response received, stopping the snow. ❄️");
      });
    });
};

module.exports = {
  startSnow,
  stopSnow,
  createSnowLine,
  checkUserResponse,
  updateSnowIntensity,
};
