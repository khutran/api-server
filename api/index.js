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

import ViewAuth from "./auth/views";
import ViewUser from "./user/views";
import ViewHost from "./host/views";
import ViewAdmin from "./admin/views";
import ViewProject from "./project/views";

router.use("/", ViewAuth);
router.use("/", ViewUser);
router.use("/", ViewHost);
router.use("/", ViewAdmin);
router.use("/", ViewProject);

router.use("/api", RouterAuth);
router.use("/api", RouterUser);
router.use("/api", RouterHost);
router.use("/api", RouterAdmin);
router.use("/api", RouterProject);
router.use("/api", RouterStatus);
router.use("/api", RouterRole);
router.use("/api", RouterSshKey);

export default router;