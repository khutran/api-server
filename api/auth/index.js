import express from 'express';
import ApiLogin from './login';

let router = express.Router();
router.use('/login', ApiLogin);

export default router;
