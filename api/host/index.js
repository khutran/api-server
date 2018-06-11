import express from 'express';
import ApiServer from './host';
let router = express.Router();
router.use('/host', ApiServer);

export default router;
