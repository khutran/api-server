import express from 'express';
import ApiV1Router from './v1';
let router = express.Router();

router.use('/v1', ApiV1Router);

export default router;
