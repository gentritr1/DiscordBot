const StudySession = require("../models/StudySession");
const moment = require("moment");
require("moment-duration-format");
const getRandomMessage = require("../utils/getRandomMessage");
const dbService = require("./dbService");

class StudyService {
  async startStudySession(userId) {
    await dbService.connect();

    const existingSession = await StudySession.findOne({
      userId: userId,
      studyEnd: null,
    });

    if (existingSession) {
      return "You already have an ongoing study session.";
    }

    const newSession = new StudySession({
      userId: userId,
      studyStart: new Date(),
    });
    await newSession.save();

    return "Study session started!";
  }

  async endStudySession(userId) {
    await dbService.connect();

    const session = await StudySession.findOneAndUpdate(
      { userId: userId, studyEnd: null },
      { studyEnd: new Date() },
      { new: true }
    );

    if (!session) {
      return "You do not have an ongoing study session.";
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

    return `Study session stopped! Total time studied: ${formattedDuration}. ${responseMessage}`;
  }
}

module.exports = new StudyService();
