import { relations } from "drizzle-orm/relations";
import {
  accounts,
  profile,
  resetTokens,
  user,
  verifyEmailTokens,
} from "./schema";

export const verifyEmailTokensRelations = relations(
  verifyEmailTokens,
  ({ one }) => ({
    user: one(user, {
      fields: [verifyEmailTokens.userId],
      references: [user.id],
    }),
  })
);

export const userRelations = relations(user, ({ many }) => ({
  verifyEmailTokens: many(verifyEmailTokens),
  accounts: many(accounts),
  profiles: many(profile),
  resetTokens: many(resetTokens),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(user, {
    fields: [accounts.userId],
    references: [user.id],
  }),
}));

export const profileRelations = relations(profile, ({ one }) => ({
  user: one(user, {
    fields: [profile.userId],
    references: [user.id],
  }),
}));

export const resetTokensRelations = relations(resetTokens, ({ one }) => ({
  user: one(user, {
    fields: [resetTokens.userId],
    references: [user.id],
  }),
}));
