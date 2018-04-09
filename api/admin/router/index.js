import express from "express";
let router = express.Router();
import ApiAdmin from "./admin";

router.use('/admin', ApiAdmin);

export default router;