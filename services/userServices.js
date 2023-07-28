const User = require('../models/userModels');

const userService = {
  async createUser(firstName, lastName, email, birthday, location, timeZone) {
    return User.create({ firstName, lastName, email, birthday, location, timeZone });
  },
  async updateUser(id, firstName, lastName, email, birthday, location, timeZone) {
    const user = await User.findByPk(id);
    if (!user) {
      return null;
    }

    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.birthday = birthday;
    user.location = location;
    user.timeZone = timeZone;
    await user.save();

    return user;
  },

  async deleteUser(id) {
    const user = await User.findByPk(id);
    if (!user) {
      return null;
    }
  
    await user.destroy();
    return { message: 'User deleted successfully.' };
  }
};

module.exports = userService;