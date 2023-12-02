const congratulationsMessages = [
  "Great job! Keep up the good work!",
  "You're on fire! 🔥 Keep it going!",
  "Outstanding session! Your focus is inspiring!",
  // Add more responses here
];

const encouragementMessages = [
  "Almost there, don't give up now!",
  "Remember, every minute counts! You've got this!",
  "It's just a bump on the road, keep pushing!",
  // Add more responses here
];

const mafiaMessages = [
  "I'm gonna make you an offer you can't refuse. Try a correct command.",
  "You talking to me? That's not a command I recognize.",
  "Eh, funny how? Like a clown? Use the right commands, please.",
  // Add more responses here
];

const getRandomMessage = (type) => {
  switch (type) {
    case "congratulations":
      return congratulationsMessages[
        Math.floor(Math.random() * congratulationsMessages.length)
      ];
    case "encouragement":
      return encouragementMessages[
        Math.floor(Math.random() * encouragementMessages.length)
      ];
    case "mafia":
      return mafiaMessages[Math.floor(Math.random() * mafiaMessages.length)];
    default:
      return "Oops! Something went wrong.";
  }
};

module.exports = getRandomMessage;
