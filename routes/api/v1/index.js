import express from 'express';
import UserRouter from './users';
import MeRouter from './me';
import AuthRouter from './auth';
import RoleRouter from './roles';
import PermissionRouter from './permissions';
import ProjectRouter from './projects';
import StatusRouter from './status';

var router = express.Router();

router.use('/users', UserRouter);
router.use('/me', MeRouter);
router.use('/auth', AuthRouter);
router.use('/roles', RoleRouter);
router.use('/permissions', PermissionRouter);
router.use('/projects', ProjectRouter);
router.use('/status', StatusRouter);

export default router;
