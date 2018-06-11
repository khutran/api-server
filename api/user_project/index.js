import express from 'express';
import ApiUserProject from './user_project';

let router = express.Router();
router.use('/user', ApiUserProject);

export default router;
