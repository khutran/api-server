const defaultType = process.env.PASSWORD_ENCRYPTION ? process.env.PASSWORD_ENCRYPTION : 'bcrypt';

export default class PasswordUtil {
  constructor(type) {
    this.fn = require('./' + (type ? type : defaultType));
  }
  static get DEFAULT_PASSWORD() {
    return defaultType;
  }
  encrypt(password) {
    return this.fn.encrypt(password);
  }
  compare(password, originalPassword) {
    return this.fn.compare(password, originalPassword);
  }
}
