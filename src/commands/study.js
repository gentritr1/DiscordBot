const StudyService = require("../services/studyService");
const {
  contextualResponse,
  sendRandomizedResponse,
} = require("../utils/responseUtils");
const studyService = new StudyService();

const execute = async (message, args) => {
  let response = contextualResponse(message);

  if (args[0] === "start") {
    response = await studyService.startStudySession(message.author.id);
    response +=
      "\n" + (await studyService.getPersonalizedMessage(message.author.id));
  } else if (args[0] === "stop") {
    response = await studyService.endStudySession(message.author.id);
  }

  sendRandomizedResponse(message, response);
};

module.exports = {
  name: "study",
  execute,
};
