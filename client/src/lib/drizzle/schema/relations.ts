import { relations } from "drizzle-orm/relations";
import { user, accounts, resetTokens, verifyEmailTokens } from "./schema";

export const accountsRelations = relations(accounts, ({one}) => ({
	user: one(user, {
		fields: [accounts.userId],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	accounts: many(accounts),
	resetTokens: many(resetTokens),
	verifyEmailTokens: many(verifyEmailTokens),
}));

export const resetTokensRelations = relations(resetTokens, ({one}) => ({
	user: one(user, {
		fields: [resetTokens.userId],
		references: [user.id]
	}),
}));

export const verifyEmailTokensRelations = relations(verifyEmailTokens, ({one}) => ({
	user: one(user, {
		fields: [verifyEmailTokens.userId],
		references: [user.id]
	}),
}));