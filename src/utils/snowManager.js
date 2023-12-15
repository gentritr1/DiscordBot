const SnowballService = require("../services/SnowballService");
const { v4: uuidv4 } = require("uuid"); // If using the 'uuid' library

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

let inactivityWarnings = new Map();
let currentGameRoomId = null;
let isSimulationActive = false;
let actionQueue = [];
const inactivityTimeout = 120000; // Inactivity timeout in milliseconds (e.g., 120000ms for 2 minutes)

let currentRound = 0;
const totalRounds = 3; // Total number of rounds before the boss appears
const bossTarget = { name: "Snowzilla", difficulty: 5, points: 100 }; // Boss

const totalSimulationRounds = 5; // Total rounds for the simulation

const simulatedPlayers = [
  { id: "simulatedPlayer1", username: "Ibish" },
  { id: "simulatedPlayer2", username: "Shota" },
  { id: "simulatedPlayer3", username: "Galica" },
  // Add more simulated players as needed
];

const soloTargets = [
  { name: "Snowman", difficulty: 1, points: 10 },
  { name: "Ice Sculpture", difficulty: 2, points: 20 },
  { name: "Frozen Tree", difficulty: 3, points: 30 },
  { name: "Roaming Penguin", difficulty: 4, points: 40 },
];

const startSimulation = async (message) => {
  isSimulationActive = true;
  await simulatePlayerJoin(message); // Await all joins

  actionQueue = [...simulatedPlayers];
  proceedWithNextAction(message);
};

const proceedWithNextAction = (message) => {
  if (
    !isSimulationActive ||
    actionQueue.length === 0 ||
    currentRound >= totalSimulationRounds
  ) {
    endSimulation(message);
    return;
  }

  const currentPlayer = actionQueue.shift();
  simulatePlayerAction(message, currentPlayer);
  actionQueue.push(currentPlayer);

  if (actionQueue[0].id === simulatedPlayers[0].id) {
    // A round is completed when the first player in the queue is up again
    currentRound++;
    message.channel.send(`🔄 Round ${currentRound} completed.`);
    displayLeaderboard(message.channel);
  }

  setTimeout(() => proceedWithNextAction(message), 5000);
};

const simulatePlayerJoin = async (message) => {
  for (const player of simulatedPlayers) {
    await joinSnowballFight(message, player);
  }
};

const simulatePlayerAction = async (message, player) => {
  const playerIndex = simulatedPlayers.findIndex((p) => p.id === player.id);
  const targetIndex = (playerIndex + 1) % simulatedPlayers.length;
  const targetUsername = simulatedPlayers[targetIndex].username;

  const doesHit = Math.random() < 0.5;
  if (doesHit) {
    message.channel.send(
      `💥 ${player.username} hits ${targetUsername} with a snowball!`
    );
    await SnowballService.updateGameStats(player.id, true); // Update stats for a hit
  } else {
    message.channel.send(
      `❌ ${player.username} misses the throw at ${targetUsername}!`
    );
  }
};

const endSimulation = (message) => {
  isSimulationActive = false;
  actionQueue = [];
  clearAllInactivityTimers();
  displayLeaderboard(message.channel); // Display final leaderboard
  message.channel.send("🏁 Simulation ended.");
};

const clearAllInactivityTimers = () => {
  inactivityWarnings.forEach((timer, userId) => {
    clearTimeout(timer);
    inactivityWarnings.delete(userId);
  });
};

const resetInactivityTimer = (userId, channel, username) => {
  if (!isSimulationActive) {
    return; // Don't set inactivity timers if simulation is not active
  }

  if (inactivityWarnings.has(userId)) {
    clearTimeout(inactivityWarnings.get(userId));
  }

  inactivityWarnings.set(
    userId,
    setTimeout(() => {
      warnInactivePlayer(userId, username, channel);
    }, inactivityTimeout)
  );
};

const warnInactivePlayer = (userId, username, channel) => {
  if (!isSimulationActive) {
    return; // Skip inactivity handling if simulation is not active
  }

  if (inactivityWarnings.has(userId)) {
    channel.send(
      `${username}, you have been removed from the snowball fight due to inactivity.`
    );
    const userData = { id: userId, username };
    leaveSnowballFight(userData, channel);
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

const startNewSnowballFight = async (message) => {
  currentGameRoomId = uuidv4(); // Generate a unique room ID
  await SnowballService.createGameRoom(currentGameRoomId); // Create a new game room with the generated ID
  message.channel.send("A new snowball fight has started!");
};

const throwSnowballSolo = async (message, thrower) => {
  if (currentRound >= totalRounds) {
    // Boss round logic
    const hit = Math.random() < 0.5; // Simplified hit chance
    if (hit) {
      message.channel.send(
        `🎯 ${thrower.username} defeated ${bossTarget.name} and earned ${bossTarget.points} points!`
      );
      currentRound = 0; // Reset rounds for next game
    } else {
      message.channel.send(`❌ ${thrower.username} missed ${bossTarget.name}!`);
    }
    return;
  }

  const target = soloTargets[Math.floor(Math.random() * soloTargets.length)];

  const hit = Math.random() < 1 / target.difficulty; // Hit chance based on difficulty
  if (hit) {
    message.channel.send(
      `🎯 ${thrower.username} hit the ${target.name} and earned ${target.points} points!`
    );
    // Update player's score here
  } else {
    message.channel.send(`❌ ${thrower.username} missed the ${target.name}!`);
  }

  currentRound++;
  if (currentRound >= totalRounds) {
    message.channel.send("Boss round is coming up next!");
  }
};

const joinSnowballFight = async (message, user) => {
  if (!currentGameRoomId) {
    await startNewSnowballFight(message);
  }

  await SnowballService.addParticipantToRoom(
    currentGameRoomId,
    user.id,
    user.username
  );
  inactivityWarnings.set(
    user.id,
    setTimeout(
      () => warnInactivePlayer(user.id, user.username, message.channel),
      120000
    )
  );
  message.channel.send(`${user.username} has joined the snowball fight! ❄️🌨️`);
};

const leaveSnowballFight = async (user, channel) => {
  const remainingParticipants = await SnowballService.removeParticipantFromRoom(
    currentGameRoomId,
    user.id
  );
  clearTimeout(inactivityWarnings.get(user.id));
  inactivityWarnings.delete(user.id);
  channel.send(`${user.username} has left the snowball fight.`);

  if (remainingParticipants < 2) {
    currentGameRoomId = null; // Reset the game room ID
    channel.send("Snowball fight has ended due to lack of participants.");
  }
};

const throwSnowballMultiplayer = async (message, thrower, targetUsername) => {
  const target = await SnowballService.getParticipant(
    currentGameRoomId,
    targetUsername
  );
  if (!target) {
    message.reply(`Could not find ${targetUsername} in the snowball fight.`);
    return;
  }

  const hit = Math.random() < 0.5; // Simplified hit logic
  if (hit) {
    message.channel.send(
      `💥 ${thrower.username} hit ${target.username} with a snowball!`
    );
    await SnowballService.updateGameStats(thrower.id, true, null); // Update stats for a hit
  } else {
    message.channel.send(
      `❌ ${thrower.username} missed ${target.username} with a snowball!`
    );
    await SnowballService.updateGameStats(thrower.id, false, null); // Update stats for a miss
  }

  // Update and check the round
  await SnowballService.updateRound(currentGameRoomId, 1);
  const currentRound = await SnowballService.getGameRoomCurrentRound(
    currentGameRoomId
  );

  if (currentRound >= totalRounds) {
    // Conclude the game after the set number of rounds
    await concludeGame(message.channel);
  }

  resetInactivityTimer(thrower.id, message.channel, thrower.username);
};

const concludeGame = async (channel) => {
  const finalStats = await SnowballService.getAllParticipantsStats(
    currentGameRoomId
  );
  finalStats.sort((a, b) => b.hits - a.hits); // Sort by hits, descending

  let winner = finalStats.length > 0 ? finalStats[0] : null;
  if (winner) {
    channel.send(
      `🏆 The winner is ${winner.username} with ${winner.hits} hits!`
    );
  } else {
    channel.send("No winner could be determined.");
  }

  displayLeaderboard(channel);
  currentGameRoomId = null; // Reset for a new game
};

const displayLeaderboard = async (channel) => {
  const finalStats = await SnowballService.getAllParticipantsStats(
    currentGameRoomId
  );
  finalStats.sort((a, b) => b.hits - a.hits); // Sort by hits, descending

  let leaderboardMessage = "🏆 Snowball Fight Leaderboard 🏆\n";
  finalStats.forEach((playerStats, index) => {
    leaderboardMessage += `${index + 1}. ${playerStats.username}: ${
      playerStats.hits
    } hits\n`;
  });

  channel.send(leaderboardMessage);
};

module.exports = {
  startSnow,
  stopSnow,
  createSnowLine,
  checkUserResponse,
  updateSnowIntensity,
  updateSnowTheme,
  throwSnowballMultiplayer,
  throwSnowballSolo,
  leaveSnowballFight,
  joinSnowballFight,
  endSimulation,
  startSimulation,
};
