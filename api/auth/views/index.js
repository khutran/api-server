import express from "express";
let router = express.Router();
import ViewLogin from "./login";

router.use('/login', ViewLogin);

export default router;