import express from "express";
let router = express.Router();
import ApiSshKey from "./host_sshkey";

router.use('/sshkey', ApiSshKey);

export default router;