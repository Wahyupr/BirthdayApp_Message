
const userService = require('../services/userServices');

const userController = {
  async createUser(req, res) {
    try {
      const { firstName, lastName, email, birthday, location, timeZone} = req.body;
      const user = await userService.createUser(firstName, lastName, email, birthday, location, timeZone);
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Email Already Exists' });
    }
  },

  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { firstName, lastName, email, birthday, location,timeZone} = req.body;
      const user = await userService.updateUser(id, firstName, lastName, email, birthday, location,timeZone);
      if (!user) {
        res.status(404).json({ error: 'User not found!' });
      } else {
        res.json(user);
      }
    } catch (error) {
      res.status(500).json({ error: 'Something went wrong!' });
    }
  },
  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const message = await userService.deleteUser(id);
      if (!message) {
        res.status(404).json({ error: 'User not found!' });
      } else {
        res.json(message);
      }
    } catch (error) {
      res.status(500).json({ error: 'Something went wrong!' });
    }
  },
};

module.exports = userController;
