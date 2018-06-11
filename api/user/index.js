import express from 'express';
import ApiUser from './user';

let router = express.Router();
router.use('/user', ApiUser);

export default router;
