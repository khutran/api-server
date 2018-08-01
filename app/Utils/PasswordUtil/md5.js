var crypto = require('crypto');

module.exports = {
    encrypt(password) {
        //use salt as well as an extra security since md5 is super vulnerable
        let salt = crypto.randomBytes(4).toString('hex');
        return `${crypto.createHash('md5').update(salt + password).digest("hex")}:${salt}`;
    },
    compare(password, originalPassword) {
        //when password changed through magento admin it will create a salt, so we need to compare that also by concating salt to real password
        let md5Password = "";
        if (originalPassword.split(':').length > 1) {
            let originalPasswordSplit = originalPassword.split(':');
            originalPassword = originalPasswordSplit[0];
            let salt = originalPasswordSplit[1];
            md5Password = new Buffer(crypto.createHash('md5').update(salt + password).digest("hex"));
        } else {
            md5Password = new Buffer(crypto.createHash('md5').update(password).digest("hex"));
        }


        return crypto.timingSafeEqual(md5Password, new Buffer(originalPassword));
    }
};