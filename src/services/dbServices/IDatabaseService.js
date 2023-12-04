// Interface for database services
class IDatabaseService {
  async connect() {}
  async disconnect() {}
  // other common database methods
}

module.exports = IDatabaseService;
