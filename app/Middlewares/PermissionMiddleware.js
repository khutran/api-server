import { Auth } from '../Services/Facades/Auth';
import { AsyncMiddleware } from './AsyncMiddleware';
import { PermissionDeniedException } from '../Exceptions/PermissionDeniedException';

export const hasPermission = AsyncMiddleware(async (req, res, next) => {
  const hasPermission = await Auth.user().can(this);
  if (!hasPermission) {
    throw new PermissionDeniedException();
  } else {
    next();
  }
});
