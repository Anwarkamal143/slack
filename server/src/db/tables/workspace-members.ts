import { relations } from "drizzle-orm";
import {
  index,
  integer,
  pgTable,
  primaryKey,
  serial,
  uuid,
} from "drizzle-orm/pg-core";
import { WorkSpaceMemberRole } from "..";
import { timeStamps, workSpaceMemberRoleEnum } from "../helpers";
import { user } from "./user";
import { workSpaces } from "./work-spaces";

export const workSpaceMembers = pgTable(
  "workspace_members",
  {
    id: serial().notNull(),
    surrogateKey: uuid("surrogate_key").defaultRandom().notNull(),

    userId: integer("userId")
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
    workSpaceId: integer("workSpaceId")
      .notNull()
      .references(() => workSpaces.id, { onDelete: "cascade" }),
    role: workSpaceMemberRoleEnum().default(WorkSpaceMemberRole.member),
    ...timeStamps,
  },
  (t) => [
    primaryKey({ columns: [t.workSpaceId, t.userId] }),
    index("workspace_members_by_workspace_id_user_id").on(
      t.workSpaceId,
      t.userId
    ),
    index("workspace_members_by_user_id").on(t.userId),
    index("workspace_members_workspace_members_by_workspace_id").on(
      t.workSpaceId
    ),
    index("workspace_members_by_id").on(t.id),
  ]
);

export const workSpaceMembersRelations = relations(
  workSpaceMembers,
  ({ one }) => ({
    user: one(user, {
      fields: [workSpaceMembers.userId],
      references: [user.id],
    }),
    workSpace: one(workSpaces, {
      fields: [workSpaceMembers.workSpaceId],
      references: [workSpaces.id],
    }),
  })
);
