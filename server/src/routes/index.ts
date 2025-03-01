import { initialConfigurations } from "@/middleware/auth.middleware";
import express from "express";
import authRoutes from "./auth.routes";
import channelsRoutes from "./channels.routes";
import googleRoutes from "./google.routes";
import usersRoutes from "./users.routes";
import workspacesMembersRoutes from "./workspaces.members.routes";
import workspacesRoutes from "./workspaces.routes";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/google", googleRoutes);
router.use(initialConfigurations);
router.use("/users", usersRoutes);
router.use("/workspaces", workspacesRoutes);
router.use("/workspace-members", workspacesMembersRoutes);
router.use("/channels", channelsRoutes);
router.use("/channel-members", channelsRoutes);
export default router;
