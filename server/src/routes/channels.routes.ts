import {
  onAddChannel,
  onDeleteChannelByWorkspacendChannelIds,
  onGetUserChannelsByWorkspaceId,
  onUpdateUserChannelByWorkspaceIdChannelId,
} from "@/controllers/channels.controller";
import { isAuthenticated } from "@/middleware/auth.middleware";
import express from "express";

const router = express();

router.use(isAuthenticated);
router
  .route("")
  .delete(onDeleteChannelByWorkspacendChannelIds)
  .get(onGetUserChannelsByWorkspaceId)
  .put(onUpdateUserChannelByWorkspaceIdChannelId)
  .post(onAddChannel);
// router.route("/:id").get(isLoggedIn, getUserByID);

export default router;
