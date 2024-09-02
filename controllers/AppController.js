import { dbClient } from '../utils/db'; // Use named import
import redisClient from '../utils/redis';

class AppController {
  static async getStatus(req, res) {
    try {
      const redisAlive = redisClient.isAlive(); // Check if Redis is alive
      const dbAlive = dbClient.isAlive(); // Check if DB is alive

      res.status(200).json({ redis: redisAlive, db: dbAlive });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async getStats(req, res) {
    try {
      const usersCount = await dbClient.nbUsers(); // Get user count
      const filesCount = await dbClient.nbFiles(); // Get file count

      res.status(200).json({ users: usersCount, files: filesCount });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default AppController;
