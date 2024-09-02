import { MongoClient } from 'mongodb';
// eslint-disable-next-line import/no-unresolved
import dotenv from 'dotenv';

dotenv.config();

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || '27017';
    const database = process.env.DB_DATABASE || 'files_manager';
    const dbURL = `mongodb://${host}:${port}`;

    this.client = new MongoClient(dbURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    this.databaseName = database;

    this.connect()
      .then(() => console.log('Connected to MongoDB'))
      .catch((err) => console.error('Failed to connect:', err.message));
  }

  async connect() {
    try {
      await this.client.connect();
      this.db = this.client.db(this.databaseName);
    } catch (err) {
      console.error('Error during MongoDB connection:', err.message);
      throw err; // Rethrow the error to handle it in the calling code if needed
    }
  }

  isAlive() {
    try {
      return this.client && this.client.isConnected();
    } catch (err) {
      console.error('Error checking connection status:', err.message);
      return false;
    }
  }

  async nbUsers() {
    try {
      return await this.db.collection('users').countDocuments();
    } catch (err) {
      console.error('Error counting users:', err.message);
      return 0;
    }
  }

  async nbFiles() {
    try {
      return await this.db.collection('files').countDocuments();
    } catch (err) {
      console.error('Error counting files:', err.message);
      return 0;
    }
  }

  usersCollection() {
    return this.db.collection('users');
  }

  filesCollection() {
    return this.db.collection('files');
  }
}

const dbClient = new DBClient();
export default dbClient;
