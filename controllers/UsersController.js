const dbClient = require('../utils/db');

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;
    if (!email) {
      res.status(400).json({ error: 'Missing email' });
      return;
    }
    if (!password) {
      res.status(400).json({ error: 'Missing password' });
      return;
    }

    try {
      const userExists = await dbClient.getUserByEmail(email);
      if (userExists) {
        res.status(400).json({ error: 'Already exist' });
        return;
      }

      const newUser = await dbClient.createUser(email, password);
      res.status(201).json({ id: newUser.id, email: newUser.email });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  static async getMe(req, res) {
    const { userId } = req;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    try {
      const user = await dbClient.getUserById(userId);
      if (!user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      res.status(200).json({ id: user.id, email: user.email });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  }
}

module.exports = UsersController;
