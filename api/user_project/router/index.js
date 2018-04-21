import express from 'express';
let router = express.Router();
import ApiUserProject from './user_project';

router.use('/user', ApiUserProject);

export default router;