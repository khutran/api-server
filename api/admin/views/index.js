import express from "express";
let router = express.Router();
import ViewsAdmin from "./admin";

router.use('/admin', ViewsAdmin);

export default router;