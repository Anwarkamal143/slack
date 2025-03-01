import { relations } from "drizzle-orm";
import { pgTable, serial, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { Role } from "..";
import { isActive, roleEnum, timeStamps } from "../helpers";
import { accounts } from "./accounts";
import { channelMembers } from "./channel-members";
import { channels } from "./channels";
import { resetTokens } from "./reset-tokens";
import { verifyEmailTokens } from "./verify-email-tokens";
import { workSpaces } from "./work-spaces";
import { workSpaceMembers } from "./workspace-members";

export const user = pgTable("user", {
  id: serial().primaryKey().notNull(),
  name: text("name").notNull(),
  password: text("password"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("email_verified", {
    mode: "date",
  }),
  role: roleEnum().default(Role.USER),
  image: text("image"),
  isActive,
  surrogateKey: uuid("surrogate_key").defaultRandom().notNull(),
  ...timeStamps,
});

export const userRelations = relations(user, ({ many }) => ({
  accounts: many(accounts),
  resetTokens: many(resetTokens),
  verifyEmailTokens: many(verifyEmailTokens),
  workSpaces: many(workSpaces),
  workSpaceMembers: many(workSpaceMembers),
  channels: many(channels),
  channelMembers: many(channelMembers),
}));
