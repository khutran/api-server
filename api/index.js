import express from "express";
let router = express.Router();
import RouterAuth from "./auth/router";
import RouterUser from "./user/router";
import RouterHost from "./host/router";
import RouterAdmin from "./admin/router";
import RouterProject from "./project/router";
import RouterStatus from "./status/router";
import RouterRole from "./role/router";
import RouterSshKey from "./host_sshkey/router";
import RouterUserProject from "./user_project/router";

router.use("/api", RouterAuth);
router.use("/api", RouterUser);
router.use("/api", RouterHost);
router.use("/api", RouterAdmin);
router.use("/api", RouterProject);
router.use("/api", RouterStatus);
router.use("/api", RouterRole);
router.use("/api", RouterSshKey);
router.use("/api", RouterUserProject);

export default router;