const execute = (message) => {
  const helpMessage = `Available Commands:\n!study start - Start a study session\n!study stop - Stop a study session\n!help - Show this message`;
  message.channel.send(helpMessage);
};

module.exports = {
  name: "help",
  execute,
};
