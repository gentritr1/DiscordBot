const studyService = require("../services/studyService");

const execute = async (message, args) => {
  let response;
  if (args[0] === "start") {
    response = await studyService.startStudySession(message.author.id);
  } else if (args[0] === "stop") {
    response = await studyService.endStudySession(message.author.id);
  }

  message.reply(response);
};

module.exports = {
  name: "study",
  execute,
};
