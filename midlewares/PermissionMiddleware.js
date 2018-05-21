import * as _ from 'lodash';
import SingletonService from '../app/Services/SingletonService';

async function hasPermission(req, res, next) {
  const singleton = new SingletonService();
  let user = singleton.getUserLogin(req.me);
  let bool = false;

  if (!user.roles) {
    res.status(500);
    res.json({ message: 'Permission denied', error_code: 203 });
  }
  _.forEach(user.roles, item => {
    if (item.permissions.indexOf(this) > -1 || item.id === 1) {
      bool = true;
    }
  });

  if (bool === true) {
    next();
  } else {
    res.status(500);
    res.json({ message: 'Permission denied', error_code: 203 });
  }
}

export default hasPermission;
