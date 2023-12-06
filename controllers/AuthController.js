const uuid = require('uuid');
const redisClient = require('../utils/redis');

const AuthController = {
  getConnect: async (req, res) => {
    const authHeader = req.headers.authorization || '';
    const [email, password] = Buffer.from(authHeader.split(' ')[1],
	    'base64').toString().split(':');


    // Generate token
    const token = uuid.v4();

    // Store the token in Redis with the user ID for 24 hours
    await redisClient.set(`auth_${token}`, userId, 86400);

    res.status(200).json({ token });
  },

  getDisconnect: async (req, res) => {
    const { token } = req.headers;

    // Delete token from Redis

    res.status(204).send();
  }
};

module.exports = AuthController;

