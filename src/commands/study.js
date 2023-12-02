const StudySession = require("../models/StudySession");
const moment = require("moment");
require("moment-duration-format"); // For extended formatting options
const getRandomMessage = require("../utils/getRandomMessage");

const execute = async (message, args, connectMongoDB) => {
  await connectMongoDB();

  if (args[0] === "start") {
    const existingSession = await StudySession.findOne({
      userId: message.author.id,
      studyEnd: null,
    });
    if (existingSession) {
      message.reply("You already have an ongoing study session.");
      return;
    }

    const newSession = new StudySession({
      userId: message.author.id,
      studyStart: new Date(),
    });
    await newSession.save();
    message.reply("Study session started!");
  } else if (args[0] === "stop") {
    const session = await StudySession.findOneAndUpdate(
      { userId: message.author.id, studyEnd: null },
      { studyEnd: new Date() },
      { new: true }
    );

    if (!session) {
      message.reply("You do not have an ongoing study session.");
      return;
    }

    const duration = moment.duration(
      moment(session.studyEnd).diff(moment(session.studyStart))
    );
    const formattedDuration = duration.format(
      "h [hours], m [minutes], s [seconds]"
    );
    const messageType =
      duration.asMinutes() > 60 ? "congratulations" : "encouragement";
    const responseMessage = getRandomMessage(messageType);
    message.reply(
      `Study session stopped! Total time studied: ${formattedDuration}. ${responseMessage}`
    );
  }
};

module.exports = {
  name: "study",
  execute,
};
