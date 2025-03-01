import { relations } from "drizzle-orm";
import { integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { timeStamps } from "../helpers";
import { user } from "./user";

export const resetTokens = pgTable("reset_tokens", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  userId: integer("userId")
    .references(() => user.id, { onDelete: "cascade" })
    .unique()
    .notNull(),
  token: text("token"),
  tokenExpiresAt: integer("token_expires_at").notNull(),
  ...timeStamps,
});

export const resetTokensRelations = relations(resetTokens, ({ one }) => ({
  user: one(user, {
    fields: [resetTokens.userId],
    references: [user.id],
  }),
}));
