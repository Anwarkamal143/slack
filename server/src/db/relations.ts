import { relations } from "drizzle-orm/relations";
import {
  accounts,
  profile,
  reset_tokens,
  user,
  verify_email_tokens,
} from "./schema";

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(user, {
    fields: [accounts.userId],
    references: [user.id],
  }),
}));

export const userRelations = relations(user, ({ many }) => ({
  accounts: many(accounts),
  profiles: many(profile),
  reset_tokens: many(reset_tokens),
  verify_email_tokens: many(verify_email_tokens),
}));

export const profileRelations = relations(profile, ({ one }) => ({
  user: one(user, {
    fields: [profile.userId],
    references: [user.id],
  }),
}));

export const reset_tokensRelations = relations(reset_tokens, ({ one }) => ({
  user: one(user, {
    fields: [reset_tokens.userId],
    references: [user.id],
  }),
}));

export const verify_email_tokensRelations = relations(
  verify_email_tokens,
  ({ one }) => ({
    user: one(user, {
      fields: [verify_email_tokens.userId],
      references: [user.id],
    }),
  })
);
