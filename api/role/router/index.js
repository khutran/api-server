import express from "express";
import ApiRole from "./role";
var router = express.Router();

router.use("/role", ApiRole);
export default router;