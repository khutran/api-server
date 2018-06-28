import express from 'express';
import RouterAuth from './auth';
import RouterUser from './user';
import RouterHost from './host';
import RouterProject from './project';
import RouterStatus from './status';
import RouterRole from './role';
import RouterUserProject from './user_project';
import RouterFramework from './framework';
import RouterCsdl from './csdl';
import RouterCategories from './categories';
import RouterCloudflare from './cloudflare';

let router = express.Router();

router.use('/api', RouterAuth);
router.use('/api', RouterUser);
router.use('/api', RouterHost);
router.use('/api', RouterProject);
router.use('/api', RouterStatus);
router.use('/api', RouterRole);
router.use('/api', RouterUserProject);
router.use('/api', RouterFramework);
router.use('/api', RouterCsdl);
router.use('/api', RouterCategories);
router.use('/api', RouterCloudflare);

export default router;
