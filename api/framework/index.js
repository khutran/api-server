import express from 'express';
import frameworkApi from './framework';

let router = express.Router();

router.use('/framework', frameworkApi);

module.exports = router;
