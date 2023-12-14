const SnowballStats = require("../models/SnowballStats");
const SnowballService = require("../services/SnowballService");

let snowInterval = null;
let awaitingResponse = false;
let responseCheckInterval = null;

const snowIntensities = {
  light: { interval: 40000, flakes: 5 }, // 40 seconds, 5 flakes
  moderate: { interval: 15000, flakes: 10 }, // 15 seconds, 10 flakes
  heavy: { interval: 2500, flakes: 20 }, // 2.5 seconds, 20 flakes
};

const snowThemes = {
  classic: ["❄️", "☃️", "⛄", "🌨️"],
  festive: ["🎄", "🎁", "🎅", "🤶", "❄️", "🕯️", "🔔"],
  nature: ["🌲", "🌿", "🍂", "🌸", "❄️", "🌼", "🍁"],
  galaxy: ["🌌", "🌠", "🌟", "💫", "🌛", "🪐", "🚀"],
  ocean: ["🌊", "🐚", "🐟", "🐬", "🦀", "⚓", "🏖️"],
  // Add more themes as desired
};

let currentIntensity = "moderate";
let currentTheme = "classic";

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

  message.reply(`Let it snow with intensity ${currentIntensity}! ❄️`);
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
  const snowflakes = snowThemes[currentTheme];
  let snowLine = "";
  for (let i = 0; i < flakes; i++) {
    snowLine += snowflakes[Math.floor(Math.random() * snowflakes.length)] + " ";
  }
  return snowLine;
};

const updateSnowTheme = (message, theme) => {
  if (!snowThemes[theme]) {
    message.reply(
      "Invalid theme. Available themes: " + Object.keys(snowThemes).join(", ")
    );
    return;
  }

  currentTheme = theme;
  message.reply(`Snow theme updated to ${theme}.`);
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

let snowballFightParticipants = new Map();
let inactivityWarnings = new Map();

const soloTargets = [
  "Snowman",
  "Ice Sculpture",
  "Frozen Tree",
  "Roaming Penguin",
];

const warnInactivePlayer = (userId, username, channel) => {
  if (inactivityWarnings.has(userId)) {
    channel.send(
      `${username}, you have been removed from the snowball fight due to inactivity.`
    );
    leaveSnowballFight({ id: userId, username: username }, channel);
    inactivityWarnings.delete(userId);
  } else {
    channel.send(
      `${username}, please throw a snowball or you'll be removed for inactivity.`
    );
    inactivityWarnings.set(
      userId,
      setTimeout(() => {
        warnInactivePlayer(userId, username, channel);
      }, 60000)
    ); // 60 seconds
  }
};

const throwSnowballSolo = async (message, thrower) => {
  console.log("Throwing solo?", thrower, message);
  const target = soloTargets[Math.floor(Math.random() * soloTargets.length)];
  const hit = Math.random() < 0.5; // Simple hit/miss logic for solo play

  if (hit) {
    message.channel.send(`🎯 ${thrower.username} hit the ${target}!`);
  } else {
    message.channel.send(`❌ ${thrower.username} missed the ${target}!`);
  }

  // Reset inactivity timer since the player is active
  clearTimeout(inactivityWarnings.get(thrower.id));
  inactivityWarnings.delete(thrower.id);

  // Restart inactivity timer for next throw
  inactivityWarnings.set(
    thrower.id,
    setTimeout(() => {
      warnInactivePlayer(thrower.id, thrower.username, message.channel);
    }, 120000)
  ); // 120 seconds
};

const joinSnowballFight = async (message, user) => {
  const isNewUser = await SnowballService.joinSnowballFight(
    user.id,
    user.username
  );
  if (!isNewUser) {
    message.reply(`${user.username} is already in the snowball fight!`);
    return;
  }
  snowballFightParticipants.set(user.id, { username: user.username }); // Use user.id as key
  message.channel.send(`${user.username} has joined the snowball fight! ❄️🌨️`);
};

const leaveSnowballFight = async (user, channel) => {
  const leftSuccessfully = await SnowballService.leaveSnowballFight(user.id);
  if (!leftSuccessfully) {
    channel.send(`${user.username} is not in the snowball fight.`);
    return;
  }
  snowballFightParticipants.delete(user.id);
  channel.send(`${user.username} has left the snowball fight.`);
  if (snowballFightParticipants.size < 2) {
    snowballFightParticipants.clear();
    channel.send("Snowball fight has ended due to lack of participants.");
  }
};

const throwSnowball = async (message, thrower, targetUsername) => {
  // Reset inactivity timer
  clearTimeout(inactivityWarnings.get(thrower.id));
  inactivityWarnings.delete(thrower.id);

  if (!snowballFightParticipants.has(thrower.id)) {
    // Check using thrower.id
    message.reply("You must join the snowball fight first!");
    return;
  }

  if (snowballFightParticipants.size <= 1) {
    console.log("here since only 1 player", message, thrower);
    await throwSnowballSolo(message, thrower); // Handle solo play
    return;
  }

  let target = [...snowballFightParticipants.values()].find(
    (u) => u.username === targetUsername
  );
  if (!target) {
    message.reply(`Could not find ${targetUsername} in the snowball fight.`);
    return;
  }

  const hit = Math.random() < 0.5; // Simple hit/miss logic
  if (hit) {
    target.hits++;
    message.channel.send(
      `💥 ${thrower.username} hit ${target.username} with a snowball!`
    );
    await SnowballService.recordThrow(thrower.id, true);
  } else {
    message.channel.send(
      `❌ ${thrower.username} missed ${target.username} with a snowball!`
    );
    await SnowballService.recordThrow(thrower.id, false);
  }

  // Start inactivity timer
  inactivityWarnings.set(
    thrower.id,
    setTimeout(() => {
      warnInactivePlayer(thrower.id, thrower.username, message.channel);
    }, 120000)
  ); // 120 seconds
};

module.exports = {
  startSnow,
  stopSnow,
  createSnowLine,
  checkUserResponse,
  updateSnowIntensity,
  updateSnowTheme,
  throwSnowball,
  leaveSnowballFight,
  joinSnowballFight,
};
