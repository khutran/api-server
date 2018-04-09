import express from "express";
let router = express.Router();
import ApiLogin from "./login";

router.use('/login', ApiLogin);

export default router;