import express from "express";
import ViewProject from "./project";

var router = express.Router();

router.use("/project", ViewProject);

export default router;