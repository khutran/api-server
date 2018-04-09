import express from "express";
let router = express.Router();
import ViewUser from "./user";

router.use('/user', ViewUser);

export default router;