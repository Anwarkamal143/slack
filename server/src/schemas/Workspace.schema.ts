import { workSpaceMembers, workSpaces } from "@/db/schema";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import { z } from "zod";

export const WORKSPACE_SCHEMA = createInsertSchema(workSpaces);
export const WORKSPACE_SELECTION_SCHEMA = createSelectSchema(workSpaces);
export const WORKSPACE_UPDATE_SCHEMA = createUpdateSchema(workSpaces);
export const WORKSPACE_MEMBERS_INSERT_SCHEMA =
  createInsertSchema(workSpaceMembers);
export const WORKSPACE_MEMBERS_UPDATE_SCHEMA =
  createUpdateSchema(workSpaceMembers);

export type IWorkspaceCreate = z.infer<typeof WORKSPACE_SCHEMA>;
export type IWorkspaceSelect = z.infer<typeof WORKSPACE_SELECTION_SCHEMA>;
export type IWorkspaceUpdate = z.infer<typeof WORKSPACE_UPDATE_SCHEMA>;
export type IWorkspaceMemberCreate = z.infer<
  typeof WORKSPACE_MEMBERS_INSERT_SCHEMA
>;
export type IWorkspaceMemberUpdate = z.infer<
  typeof WORKSPACE_MEMBERS_UPDATE_SCHEMA
>;
