import { relations } from "drizzle-orm";
import { integer, pgTable, serial, text, uuid } from "drizzle-orm/pg-core";
import { WorkspacePublishStatuses } from "..";
import { isActive, timeStamps, workspacePublishStatuses } from "../helpers";
import { channels } from "./channels";
import { user } from "./user";
import { workSpaceMembers } from "./workspace-members";

export const workSpaces = pgTable("work_spaces", {
  id: serial().primaryKey().notNull(),

  name: text("name"),
  userId: integer("userId")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  joinCode: text("join_code"),
  isActive,
  status: workspacePublishStatuses()
    .default(WorkspacePublishStatuses.public)
    .notNull(),
  surrogateKey: uuid("surrogate_key").defaultRandom().notNull(),
  ...timeStamps,
});

export const workSpacesRelations = relations(workSpaces, ({ one, many }) => ({
  user: one(user, {
    fields: [workSpaces.userId],
    references: [user.id],
  }),
  workSpaceMembers: many(workSpaceMembers),
  channels: many(channels),
}));
