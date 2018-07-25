import ApiRouter from './api';
import express from 'express';
let router = express.Router();

router.use('/api', ApiRouter);

export default router;
