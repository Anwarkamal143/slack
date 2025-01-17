import { pgTable, unique, uuid, text, timestamp, foreignKey, integer, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const role = pgEnum("role", ['user', 'admin'])
export const type = pgEnum("type", ['oauth', 'email'])


export const user = pgTable("user", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text(),
	password: text(),
	email: text().notNull(),
	emailVerified: timestamp({ mode: 'string' }),
	role: role().default('user'),
	image: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("user_email_unique").on(table.email),
]);

export const accounts = pgTable("accounts", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid().notNull(),
	type: text().notNull(),
	provider: text().notNull(),
	providerAccountId: text(),
	refreshToken: text("refresh_token"),
	accessToken: text("access_token"),
	expiresAt: integer("expires_at"),
	tokenType: text("token_type"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "accounts_userId_user_id_fk"
		}).onDelete("cascade"),
]);

export const resetTokens = pgTable("reset_tokens", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid().notNull(),
	token: text(),
	tokenExpiresAt: integer("token_expires_at").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
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
	userId: uuid().notNull(),
	token: text(),
	tokenExpiresAt: integer("token_expires_at").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "verify_email_tokens_userId_user_id_fk"
		}).onDelete("cascade"),
	unique("verify_email_tokens_userId_unique").on(table.userId),
]);
