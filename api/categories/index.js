import express from 'express';
import ApiCategories from './categories';

let router = express.Router();
router.use('/categories', ApiCategories);

module.exports = router;
