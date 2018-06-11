import express from 'express';
import ApiProject from './project';
var router = express.Router();

router.use('/project', ApiProject);

export default router;
