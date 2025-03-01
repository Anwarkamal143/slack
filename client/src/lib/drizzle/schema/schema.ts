import { pgTable, unique, serial, text, timestamp, boolean, uuid, foreignKey, integer, index, primaryKey, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const accountType = pgEnum("accountType", ['email', 'oauth'])
export const role = pgEnum("role", ['admin', 'user'])
export const workspaceMemberRole = pgEnum("workspaceMemberRole", ['admin', 'guest', 'member', 'moderator'])
export const workspacePublishStatuses = pgEnum("workspacePublishStatuses", ['draft', 'private', 'public'])


export const user = pgTable("user", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	password: text(),
	email: text().notNull(),
	emailVerified: timestamp("email_verified", { mode: 'string' }),
	role: role().default('user'),
	image: text(),
	isActive: boolean("is_active").default(true).notNull(),
	surrogateKey: uuid("surrogate_key").defaultRandom().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	unique("user_email_unique").on(table.email),
]);

export const accounts = pgTable("accounts", {
	id: serial().primaryKey().notNull(),
	surrogateKey: uuid("surrogate_key").defaultRandom().notNull(),
	userId: serial().notNull(),
	type: accountType().notNull(),
	provider: text().notNull(),
	providerAccountId: text("provider_accountId"),
	refreshToken: text("refresh_token"),
	accessToken: text("access_token"),
	expiresAt: integer("expires_at"),
	tokenType: text("token_type"),
	isActive: boolean("is_active").default(true).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "accounts_userId_user_id_fk"
		}).onDelete("cascade"),
]);

export const channels = pgTable("channels", {
	id: serial().primaryKey().notNull(),
	workSpaceId: serial().notNull(),
	name: text().notNull(),
	surrogateKey: uuid("surrogate_key").defaultRandom().notNull(),
	isPrivate: boolean("is_private").default(true),
	isActive: boolean("is_active").default(true).notNull(),
	createdBy: serial().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("channel_by_workspace_id").using("btree", table.workSpaceId.asc().nullsLast().op("int4_ops")),
	index("channels_by_user_id").using("btree", table.createdBy.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.workSpaceId],
			foreignColumns: [workSpaces.id],
			name: "channels_workSpaceId_work_spaces_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.createdBy],
			foreignColumns: [user.id],
			name: "channels_createdBy_user_id_fk"
		}).onDelete("set null"),
]);

export const workSpaces = pgTable("work_spaces", {
	id: serial().primaryKey().notNull(),
	name: text(),
	userId: serial().notNull(),
	joinCode: text("join_code"),
	isActive: boolean("is_active").default(true).notNull(),
	status: workspacePublishStatuses().default('public').notNull(),
	surrogateKey: uuid("surrogate_key").defaultRandom().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "work_spaces_userId_user_id_fk"
		}).onDelete("cascade"),
]);

export const resetTokens = pgTable("reset_tokens", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: serial().notNull(),
	token: text(),
	tokenExpiresAt: integer("token_expires_at").notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "reset_tokens_userId_user_id_fk"
		}).onDelete("cascade"),
	unique("reset_tokens_userId_unique").on(table.userId),
]);

export const verifyEmailTokens = pgTable("verify_email_tokens", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: serial().notNull(),
	token: text(),
	tokenExpiresAt: integer("token_expires_at").notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "verify_email_tokens_userId_user_id_fk"
		}).onDelete("cascade"),
	unique("verify_email_tokens_userId_unique").on(table.userId),
]);

export const channelMembers = pgTable("channel_members", {
	id: serial().notNull(),
	userId: serial().notNull(),
	channelId: serial().notNull(),
	role: workspaceMemberRole().default('member'),
	surrogateKey: uuid("surrogate_key").defaultRandom().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("channel_memeber_by_channelId").using("btree", table.channelId.asc().nullsLast().op("int4_ops")),
	index("channel_memeber_by_channelId_and_userId").using("btree", table.channelId.asc().nullsLast().op("int4_ops"), table.userId.asc().nullsLast().op("int4_ops")),
	index("channel_memeber_by_id").using("btree", table.id.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "channel_members_userId_user_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.channelId],
			foreignColumns: [channels.id],
			name: "channel_members_channelId_channels_id_fk"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.userId, table.channelId], name: "channel_members_userId_channelId_pk"}),
]);

export const workspaceMembers = pgTable("workspace_members", {
	id: serial().notNull(),
	surrogateKey: uuid("surrogate_key").defaultRandom().notNull(),
	userId: serial().notNull(),
	workSpaceId: serial().notNull(),
	role: workspaceMemberRole().default('member'),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("workspace_members_by_id").using("btree", table.id.asc().nullsLast().op("int4_ops")),
	index("workspace_members_by_user_id").using("btree", table.userId.asc().nullsLast().op("int4_ops")),
	index("workspace_members_by_workspace_id_user_id").using("btree", table.workSpaceId.asc().nullsLast().op("int4_ops"), table.userId.asc().nullsLast().op("int4_ops")),
	index("workspace_members_workspace_members_by_workspace_id").using("btree", table.workSpaceId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "workspace_members_userId_user_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.workSpaceId],
			foreignColumns: [workSpaces.id],
			name: "workspace_members_workSpaceId_work_spaces_id_fk"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.userId, table.workSpaceId], name: "workspace_members_workSpaceId_userId_pk"}),
]);
