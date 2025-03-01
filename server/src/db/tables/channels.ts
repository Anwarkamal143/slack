import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgTable,
  serial,
  text,
  uuid,
} from "drizzle-orm/pg-core";
import { isActive, timeStamps } from "../helpers";
import { channelMembers } from "./channel-members";
import { user } from "./user";
import { workSpaces } from "./work-spaces";

export const channels = pgTable(
  "channels",
  {
    id: serial().primaryKey().notNull(),
    workSpaceId: integer("workSpaceId")
      .references(() => workSpaces.id, { onDelete: "cascade" })
      .notNull(),
    name: text("name").notNull(),
    surrogateKey: uuid("surrogate_key").defaultRandom().notNull(),
    isPrivate: boolean("is_private").default(true),
    isActive,
    createdBy: integer().references(() => user.id, { onDelete: "set null" }),
    ...timeStamps,
  },
  (t) => [
    //  primaryKey({ columns: [t.workSpaceId, t.userId] }),
    index("channel_by_workspace_id").on(t.workSpaceId),
    // index("channels_by_user_id").on(t.createdBy),
  ]
);

export const channelsRelations = relations(channels, ({ one, many }) => ({
  workSpace: one(workSpaces, {
    fields: [channels.workSpaceId],
    references: [workSpaces.id],
  }),
  user: one(user, {
    fields: [channels.createdBy],
    references: [user.id],
  }),
  channelMembers: many(channelMembers),
}));
