import { MongoClient } from 'mongodb';

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';
    this.url = `mongodb://${host}:${port}`;
    this.dbName = database;
    this.client = new MongoClient(this.url, { useNewUrlParser: true, useUnifiedTopology: true });
    this.db = null;
  }

  async connect() {
    if (!this.db) {
      try {
        await this.client.connect();
        this.db = this.client.db(this.dbName);
        return true;
      } catch (error) {
        console.error('MongoDB connection error:', error);
        return false;
      }
    }
    return true;
  }

  async isAlive() {
    try {
      await this.connect();
      const serverStatus = await this.db.command({ serverStatus: 1 });
      return !!serverStatus;
    } catch (error) {
      console.error('Error checking MongoDB connection:', error);
      return false;
    }
  }

  async nbUsers() {
    try {
      await this.connect();
      const count = await this.db.collection('users').countDocuments();
      return count;
    } catch (error) {
      console.error('Error fetching number of users:', error);
      return 0;
    }
  }

  async nbFiles() {
    try {
      await this.connect();
      const count = await this.db.collection('files').countDocuments();
      return count;
    } catch (error) {
      console.error('Error fetching number of files:', error);
      return 0;
    }
  }
}

const dbClient = new DBClient();
export default dbClient;
