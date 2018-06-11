import express from 'express';
import ApiStatus from './status';
let router = express.Router();

router.use('/status', ApiStatus);
export default router;
