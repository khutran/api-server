import express from 'express';
import apiCsdl from './csdl';

let router = express.Router();

router.use('/csdl', apiCsdl);

module.exports = router;
