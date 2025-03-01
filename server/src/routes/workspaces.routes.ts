import {
  onCcreateUserWorkspace,
  onDeleteCurrentUserWorkSpaceById,
  // onDeleteWorkspaceById,
  // onGetAllWorkSpaces,
  onGetCurrentUserWorkSpaceById,
  onGetCurrentUserWorkSpaces,
  // onGetWorkSpaceById,
  onUpdateCurrentUserWorkspaceById,
} from "@/controllers/workspaces.controllers";
import { isAuthenticated } from "@/middleware/auth.middleware";
import express from "express";
const router = express();
router.use(isAuthenticated);
// get loggedIn user workspaces
router.route("/").get(onGetCurrentUserWorkSpaces).post(onCcreateUserWorkspace);
// get loggedIn user workspace by workspaceId
router.route(`/:workspaceId`).get(onGetCurrentUserWorkSpaceById);
// update loggedIn user workspace by workspaceId
router.route(`/:workspaceId`).put(onUpdateCurrentUserWorkspaceById);
// delete loggedIn user workspace by workspaceId
router.route(`/:workspaceId`).delete(onDeleteCurrentUserWorkSpaceById);
// get all workspaces
// router.route("/").get(restrictTo("admin"), onGetAllWorkSpaces);
// create a workspace
// router.route("/").post(onCcreateUserWorkspace);
// // get a workspace By workspaceId
// router.route(`/:workspaceId`).get(onGetWorkSpaceById);
// // update a workspace By workspaceId
// router.route(`/:workspaceId`).put(onUpdateWorkspaceById);
// // delete a workspace By workspaceId
// router.route(`/:workspaceId`).delete(onDeleteWorkspaceById);
export default router;
