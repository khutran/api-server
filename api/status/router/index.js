import express from "express";
import ApiStatus from "./status"
var router = express.Router();

router.use('/status', ApiStatus);
export default router;