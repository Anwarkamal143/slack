import { workspaceMembers, workSpaces } from "@/lib/drizzle/schema/schema";
import { IUser } from "@/schema/user";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import { z } from "zod";

/*

    name: text(),
    userId: uuid().notNull(),
    joinCode: text(),
*/
export const WORKSPACE_UPDATE_SCEHEMA = createUpdateSchema(workSpaces, {
  name: z
    .string()
    .min(1, "Name is required")
    .min(3, "Name must be 3 charactors long"),
});

export const WORKSPACE_CREATE_SCEHEMA = createInsertSchema(workSpaces);
export const WORKSPACE_SELECT_SCEHEMA = createSelectSchema(workSpaces);
export const MEMBER_CREATE_SCEHEMA = createInsertSchema(workspaceMembers);
export const MEMBER_UPDATE_SCEHEMA = createUpdateSchema(workspaceMembers);
export const MEMBER_SELECT_SCEHEMA = createSelectSchema(workspaceMembers);
export const CREATE_WORK_SPACE_SCHEMA = z.object({
  name: z
    .string()
    .min(1, "Work space name is required")
    .min(3, "Work space name must be 3 charactors long.")
    .max(70, "Work space name must be less than 70 charactors long."),
});

export type IWorkSpaceUpdate = z.infer<typeof WORKSPACE_UPDATE_SCEHEMA>;
export type IWorkSpace = z.infer<typeof WORKSPACE_SELECT_SCEHEMA>;
export type IWorkSpaceInsert = z.infer<typeof WORKSPACE_CREATE_SCEHEMA>;
export type IWorkspaceMember = z.infer<typeof MEMBER_SELECT_SCEHEMA>;
export type IMemberWorkspaces = IWorkspaceMember & {
  workSpace: IWorkSpace;
};

export type IWorkspaceMemebrsWithUsers = IWorkspaceMember & {
  user: Omit<IUser, "password">;
};
