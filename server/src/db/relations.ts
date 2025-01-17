import { relations } from "drizzle-orm/relations";
import { accounts, reset_tokens, user, verify_email_tokens } from "./schema";

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(user, {
    fields: [accounts.userId],
    references: [user.id],
  }),
}));

export const userRelations = relations(user, ({ many }) => ({
  accounts: many(accounts),
  reset_tokens: many(reset_tokens),
  verify_email_tokens: many(verify_email_tokens),
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
