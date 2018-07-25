import { Auth } from '../app/Services/Facades/Auth';

const hasPermission = function(req, res, next) {
  Auth.user()
    .can(this)
    .then(result => {
      if (result) {
        next();
      }
    })
    .catch(e => {
      res.status(500);
      res.json(e);
    });
};

export default hasPermission;
