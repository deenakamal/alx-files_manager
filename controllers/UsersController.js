import sha1 from 'sha1';
import { dbClient } from '../utils/db'; // Adjusted to avoid named-as-default error

class UsersController {
  static async postNew(req, res) {
    try {
      const { email, password } = req.body;

      if (!email) {
        return res.status(400).json({ error: 'Missing email' });
      }
      if (!password) {
        return res.status(400).json({ error: 'Missing password' });
      }

      // Check if user already exists
      const existingUser = await dbClient.usersCollection().findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Already exist' });
      }

      // Hash the password
      const hashedPassword = sha1(password);

      // Insert the new user into the database
      const result = await dbClient.usersCollection().insertOne({
        email,
        password: hashedPassword,
      });

      // Return the new user
      const newUser = {
        id: result.insertedId,
        email,
      };

      return res.status(201).json(newUser); // Ensures a value is returned
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default UsersController;
