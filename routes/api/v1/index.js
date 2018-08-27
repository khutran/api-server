import express from 'express';
import UserRouter from './users';
import MeRouter from './me';
import AuthRouter from './auth';
import RoleRouter from './roles';
import PermissionRouter from './permissions';
import ProjectRouter from './projects';
import StatusRouter from './status';
import FrameworkRouter from './frameworks';
import ServerRouter from './servers';
import CategoryRouter from './categories';
import RemoteRouter from './remote';
import CloudflareRouter from './cloudflare';
import ViwebsiteRouter from './viwebsite';

var router = express.Router();

router.use('/users', UserRouter);
router.use('/me', MeRouter);
router.use('/auth', AuthRouter);
router.use('/roles', RoleRouter);
router.use('/permissions', PermissionRouter);
router.use('/projects', ProjectRouter);
router.use('/status', StatusRouter);
router.use('/frameworks', FrameworkRouter);
router.use('/servers', ServerRouter);
router.use('/categories', CategoryRouter);
router.use('/remote/project', RemoteRouter);
router.use('/cloudflare', CloudflareRouter);
router.use('/viwebsite', ViwebsiteRouter);

export default router;
