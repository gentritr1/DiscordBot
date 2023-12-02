// Randomized Response Timings
function sendRandomizedResponse(message, response) {
  const delay = Math.random() * 1500;
  setTimeout(() => {
    message.reply(response);
  }, delay);
}

// Contextual Responses
function contextualResponse(message) {
  const hour = new Date().getHours();
  if (message.content.includes("tired")) {
    return "Feeling tired? Remember to take breaks and stay hydrated!";
  } else if (hour < 12) {
    return "Good morning! Ready for another productive day?";
  } else if (hour >= 18) {
    return "Good evening! Wrapping up or just getting started?";
  } else {
    return null;
  }
}

module.exports = { sendRandomizedResponse, contextualResponse };
