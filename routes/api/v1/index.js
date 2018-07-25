import express from 'express';
import UserRouter from './users';
import MeRouter from './me';
import AuthRouter from './auth';
import RoleRouter from './roles';
import PermissionRouter from './permissions';

var router = express.Router();

router.use('/users', UserRouter);
router.use('/me', MeRouter);
router.use('/auth', AuthRouter);
router.use('/roles', RoleRouter);
router.use('/permissions', PermissionRouter);

export default router;
