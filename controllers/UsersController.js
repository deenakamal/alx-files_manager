import sha1 from 'sha1';
import dbClient from '../utils/db';

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
      const result = await dbClient.usersCollection().insertOne({ email, password: hashedPassword });

      // Return the new user
      const newUser = {
        id: result.insertedId,
        email,
      };

      res.status(201).json(newUser);
    } catch (error) {
      console.error('Error creating user:', error);  // Detailed error logging
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default UsersController;
