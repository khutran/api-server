import { Auth } from '../app/Services/Facades/Auth';

export const isRole = async (req, res, next) => {
  let results = await Auth.user().isRole(this);

  if (results === true) {
    next();
  } else {
    res.status(500);
    res.json({ message: 'User not is role', error_code: 500 });
  }
};
