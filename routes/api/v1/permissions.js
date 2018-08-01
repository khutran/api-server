import express from 'express';
import { AuthMiddleware } from '../../../app/Middlewares/AuthMiddleware';

let router = express.Router();

router.all('*', AuthMiddleware);

module.exports = router;
