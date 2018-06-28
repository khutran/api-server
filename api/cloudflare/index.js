import express from 'express';
import ApiCloudflare from './cloudflare';

let router = express.Router();

router.use('/cloudflare', ApiCloudflare);

module.exports = router;
