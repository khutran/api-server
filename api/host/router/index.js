import express from "express";
let router = express.Router();
import ApiServer from "./host";

router.use('/host', ApiServer);

export default router;