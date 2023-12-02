const congratulationsMessages = [
  "Great job! Keep up the good work!",
  "You're on fire! 🔥 Keep it going!",
  "Outstanding session! Your focus is inspiring!",
  "Even Don Corleone had to start somewhere. Your empire is just beginning.",
  // Add more responses here
];

const encouragementMessages = [
  "Just like Tony Soprano, you're the boss of this situation. Command it with confidence",
  "Remember, every minute counts! You've got this!",
  "In the words of Henry Hill in Goodfellas, 'Never rat on your friends and always keep studying",
  "As Paulie said, now you go home and get your shine box – of achievements!",
  "You may not be in the Irishman, but you've got the endurance to go the distance.",
  "Remember, every wise guy started as a newbie. You're getting wiser every day!",
  // Add more responses here
];

const mafiaMessages = [
  "I'm gonna make you an offer you can't refuse. Try a correct command.",
  "You talking to me? That's not a command I recognize.",
  "Eh, funny how? Like a clown? Use the right commands, please.",
  "In this family, we use the right commands. Capisce?",
  "This bot isn't just business, it's personal. Use your commands wisely.",
  "An offer you can't refuse: using commands the right way.",
  "We don't make mistakes here; we make... unexpected command choices.",
  "Just when I thought I was out, they pull me back in with a correct command.",
  "Leave the gun, take the cannoli... and maybe use the right command next time.",
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
