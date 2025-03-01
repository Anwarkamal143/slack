import { relations } from "drizzle-orm/relations";
import { user, accounts, workSpaces, channels, resetTokens, verifyEmailTokens, channelMembers, workspaceMembers } from "./schema";

export const accountsRelations = relations(accounts, ({one}) => ({
	user: one(user, {
		fields: [accounts.userId],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	accounts: many(accounts),
	channels: many(channels),
	workSpaces: many(workSpaces),
	resetTokens: many(resetTokens),
	verifyEmailTokens: many(verifyEmailTokens),
	channelMembers: many(channelMembers),
	workspaceMembers: many(workspaceMembers),
}));

export const channelsRelations = relations(channels, ({one, many}) => ({
	workSpace: one(workSpaces, {
		fields: [channels.workSpaceId],
		references: [workSpaces.id]
	}),
	user: one(user, {
		fields: [channels.createdBy],
		references: [user.id]
	}),
	channelMembers: many(channelMembers),
}));

export const workSpacesRelations = relations(workSpaces, ({one, many}) => ({
	channels: many(channels),
	user: one(user, {
		fields: [workSpaces.userId],
		references: [user.id]
	}),
	workspaceMembers: many(workspaceMembers),
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

export const channelMembersRelations = relations(channelMembers, ({one}) => ({
	user: one(user, {
		fields: [channelMembers.userId],
		references: [user.id]
	}),
	channel: one(channels, {
		fields: [channelMembers.channelId],
		references: [channels.id]
	}),
}));

export const workspaceMembersRelations = relations(workspaceMembers, ({one}) => ({
	user: one(user, {
		fields: [workspaceMembers.userId],
		references: [user.id]
	}),
	workSpace: one(workSpaces, {
		fields: [workspaceMembers.workSpaceId],
		references: [workSpaces.id]
	}),
}));