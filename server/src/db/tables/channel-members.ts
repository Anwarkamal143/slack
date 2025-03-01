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
import { channels } from "./channels";
import { user } from "./user";

export const channelMembers = pgTable(
  "channel_members",
  {
    id: serial().notNull(),

    userId: integer("userId")
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
    channelId: integer("channelId")
      .notNull()
      .references(() => channels.id, { onDelete: "cascade" }),
    role: workSpaceMemberRoleEnum().default(WorkSpaceMemberRole.member),
    surrogateKey: uuid("surrogate_key").defaultRandom().notNull(),
    ...timeStamps,
  },
  (t) => [
    primaryKey({ columns: [t.userId, t.channelId] }),
    index("channel_memeber_by_channelId").on(t.channelId),
    index("channel_memeber_by_channelId_and_userId").on(t.channelId, t.userId),
    index("channel_memeber_by_id").on(t.id),
  ]
);

export const membersRelations = relations(channelMembers, ({ one }) => ({
  user: one(user, {
    fields: [channelMembers.userId],
    references: [user.id],
  }),
  channel: one(channels, {
    fields: [channelMembers.channelId],
    references: [channels.id],
  }),
}));
