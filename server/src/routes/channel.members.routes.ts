import {
  onAddMemberToWorkSpace,
  onGetMemberWithWorkspaceByWorkspaceIdIfIsMember,
  onGetMembers,
  onGetMembersByUserIdIfIsMember,
  onGetMembersByWorkspaceIdIfIsMember,
  onRemoveMemberFromWorkSpace,
  onRemoveUserMemberFromWorkSpace,
  onUpdateUserWorkspaceMember,
  onUpdateWorkspaceMember,
} from "@/controllers/workspacemembers.controllers";
import { isAuthenticated, restrictTo } from "@/middleware/auth.middleware";
import express from "express";
const router = express();
router.use(isAuthenticated);
// update member
router.route("/").put(restrictTo("admin"), onUpdateWorkspaceMember);
// get members with workspces by (userId || workspaceId) (query)
router.route("/").get(restrictTo("admin"), onGetMembers);
// create member
router.route("/").post(restrictTo("admin"), onAddMemberToWorkSpace);
// remove member by (userId and workspaceId) (query)
router.route("/").delete(restrictTo("admin"), onRemoveMemberFromWorkSpace);
// get: loggedIn user => members with workspaces by workspaceId (query) // if user is also member
router
  .route(`/by-workspaceId`)
  .get(onGetMembersByWorkspaceIdIfIsMember)
  .delete(onRemoveUserMemberFromWorkSpace)
  .put(onUpdateUserWorkspaceMember);
// get: loggedIn user => members with workspaces by userId (query) // if user is also member
router.route(`/by-userId`).get(onGetMembersByUserIdIfIsMember);
// get: loggedIn user => members with workspaces by workspaceId (query) // if user is also member
router
  .route(`/member-workspace`)
  .get(onGetMemberWithWorkspaceByWorkspaceIdIfIsMember);
// get: loggedIn user => getWorkspace if member

// router.route(`/by-memberId`).delete(isAuthenticated);
export default router;
