const bcrypt = require('bcrypt-nodejs');

module.exports = {
  encrypt(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  },
  compare(password, originalPassword) {
    return bcrypt.compareSync(password, originalPassword);
  }
};
