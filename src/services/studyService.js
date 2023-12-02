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

  async getUserInteractionHistory(userId) {
    try {
      const sessions = await StudySession.find({ userId: userId });
      return {
        isNewUser: sessions.length <= 1, // since we are first saving and giving another message -> indicator that studying has started.
        frequentUser: sessions.length > 5,
      };
    } catch (error) {
      console.error("Error fetching user history:", error);
      return { isNewUser: true, frequentUser: false };
    }
  }

  async getPersonalizedMessage(userId) {
    const userHistory = await this.getUserInteractionHistory(userId);

    if (userHistory.isNewUser) {
      return "Welcome to your first study session! Let's get started!";
    } else if (userHistory.frequentUser) {
      return "Back again? Your dedication is impressive!";
    } else {
      return "";
    }
  }
}

module.exports = StudyService;
