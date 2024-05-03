const MongoClient = require('mongodb').MongoClient;

class MongoDBConnect {
  constructor() {
    this.connection = this.connect();
  }

  async connect() {
    const uri = 'mongodb+srv://20130127:BT8RyXF5mvDfNZRj@database1.twpymwy.mongodb.net/ExamMasterData';
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
    if (this.connection) {
      await this.connection.close();
      console.log('MongoDB connection closed');
    }
  }

  static async getInstance() {
    if (!MongoDBConnect.instance) {
      MongoDBConnect.instance = new MongoDBConnect();
      await MongoDBConnect.instance.connection;
    }
    return MongoDBConnect.instance;
  }
}

module.exports = MongoDBConnect;
