import express from "express";
let router = express.Router();
import ApiUser from "./user";

router.use('/user', ApiUser);

export default router;