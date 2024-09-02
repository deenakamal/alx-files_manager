import { v4 as uuidv4 } from 'uuid';
import sha1 from 'sha1';
import redisClient from '../utils/redis';
import { dbClient } from '../utils/db';

class AuthController {
  static async getConnect(req, res) {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Basic ')) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const base64Credentials = authHeader.replace('Basic ', '');
      const credentials = Buffer.from(base64Credentials, 'base64').toString('utf8');
      const [email, password] = credentials.split(':');

      if (!email || !password) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Find user and validate password
      const hashedPassword = sha1(password);
      const user = await dbClient.usersCollection().findOne({ email, password: hashedPassword });

      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Generate a token
      const token = uuidv4();
      const key = `auth_${token}`;
      await redisClient.setex(key, 86400, user._id.toString());

      return res.status(200).json({ token }); // Ensure a value is returned
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' }); // Ensure a value is returned
    }
  }

  static async getDisconnect(req, res) {
    try {
      const token = req.headers['x-token'];

      if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const key = `auth_${token}`;
      const result = await redisClient.del(key);

      if (result === 0) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      return res.status(204).send(); // Ensure a value is returned
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' }); // Ensure a value is returned
    }
  }
}

export default AuthController;
