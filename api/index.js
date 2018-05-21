import express from 'express';
import RouterAuth from './auth/router';
import RouterUser from './user/router';
import RouterHost from './host/router';
import RouterProject from './project/router';
import RouterStatus from './status/router';
import RouterRole from './role/router';
import RouterUserProject from './user_project/router';
let router = express.Router();

router.use('/api', RouterAuth);
router.use('/api', RouterUser);
router.use('/api', RouterHost);
router.use('/api', RouterProject);
router.use('/api', RouterStatus);
router.use('/api', RouterRole);
router.use('/api', RouterUserProject);

export default router;
