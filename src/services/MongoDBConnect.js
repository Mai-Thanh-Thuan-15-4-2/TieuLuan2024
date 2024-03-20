const { MongoClient } = require('mongodb');

class MongoDBConnect {
  constructor() {
    this.connect();
  }

  async connect() {
    const uri = 'mongodb+srv://20130127:rhO5HUkJwmIM7DLn@database1.twpymwy.mongodb.net/ExamMasterData';
    const client = new MongoClient(uri);

    try {
      await client.connect();
      console.log('Connected to MongoDB');
      this.db = client.db();
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      throw error;
    }
  }

  async close() {
    if (this.client) {
      await this.client.close();
      console.log('MongoDB connection closed');
    }
  }
}

module.exports = MongoDBConnect;
