import request from "@/lib/request";
import { IWorkSpace } from "../schemas";

export * from "./use-create-workspace";
export * from "./use-get-infiniteMembersWithWorkspacesifIsMember";
export * from "./use-get-membersByWorkspaceIdIfUserIsMember";
export * from "./use-get-memberWithWorkspaceByWorkspaceIdIfIsMember";
export * from "./use-get-memberWorkspacesByUserIdIfIsMember";
export * from "./use-get-userWorkspaces";
export * from "./use-get-userWorkspacesIfMember";
export * from "./use-get-workspace";
export * from "./use-user-delete-workspace";
export * from "./use-user-update-workspace";

const WORK_SPACE_BY_ID = "user_workspace_by_id";
const USER_WORK_SPACES = "";
const MEMBERS = "workspace-members";
const WORKSPACES = "workspaces";
export const WORKSPACES_KEYS = {
  listWorkspaces: WORKSPACES,
  createWorkspace: `${WORKSPACES}:create`,
  getWorkspaceById: (workspaceId?: number) =>
    `${WORKSPACES}:getWorkspaceById:${workspaceId}`,
  deleteWorkspaceById: (workspaceId?: number) =>
    `${WORKSPACES}:deleteWorkspaceById:${workspaceId}`,
};
export const WORKSPACES_QUERY_PATHS = {
  getCurrentUserWorkspaces: USER_WORK_SPACES,
  getWorkspaces_by_UserId: (userId: number) => `${MEMBERS}/${userId}`,

  getWorkspace_by_WorkSpaceId: (workSpaceId: number) => `${workSpaceId}`,
  deleteWorkspaceById: (workspaceId?: number) => `${workspaceId}`,
};
export const MEMBERS_KEYS = {
  listWorkSpaceMembers: MEMBERS,
  listMemberWorkspacesByUserId: (userId: number) =>
    `${MEMBERS}:listMemberWorkspacesByUserId:${userId}`,
  listCurrentMemberWorkspaces: `${MEMBERS}:listCurrentMemberWorkspaces`,
  listPaginatedCurrentMemberWorkspaces: `${MEMBERS}:listPaginatedCurrentMemberWorkspaces`,

  getMemberWorkspaceByWorkspaceId: (workspaceId: number) => [
    `${MEMBERS}:getMemberWorkspaceByWorkspaceId:${workspaceId}`,
  ],
};
export const MEMBERS_QUERY_PATHS = {
  getMembersOfaWorkspace: `by-workspaceId`,
  getMembersOfaWorkspaceByUserId: `by-userId`,

  getMemberWorkspaceByWorkspaceId: `member-workspace`,
};
export const getAllWorkSpaces = async (): Promise<IWorkSpace> => {
  const res = await request("workspaces");
  return res.data;
};
