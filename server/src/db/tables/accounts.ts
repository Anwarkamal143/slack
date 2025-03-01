import { relations } from "drizzle-orm";
import { integer, pgTable, serial, text, uuid } from "drizzle-orm/pg-core";
import { accountTypeEnum, isActive, timeStamps } from "../helpers";
import { user } from "./user";

export const accounts = pgTable("accounts", {
  id: serial().primaryKey().notNull(),
  surrogateKey: uuid("surrogate_key").defaultRandom().notNull(),
  userId: integer("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  type: accountTypeEnum().notNull(),
  // type: text("type").$type<AccountType[number]>().notNull(),

  // salt: text("salt"),
  // type: text("type").notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("provider_accountId"),
  refreshToken: text("refresh_token"),
  accessToken: text("access_token"),
  expiresAt: integer("expires_at"),
  tokenType: text("token_type"),
  isActive,
  ...timeStamps,
});

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(user, {
    fields: [accounts.userId],
    references: [user.id],
  }),
}));
