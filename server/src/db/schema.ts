import {
  integer,
  pgEnum,
  pgTableCreator,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export enum Role {
  USER = "user",
  ADMIN = "admin",
}
export enum ProviderType {
  email = "email",
  google = "google",
  github = "github",
  linkedIn = "linkedIn",
}
export enum AccountType {
  oauth = "oauth",
  email = "email",
}
export function enumToPgEnum<T extends Record<string, any>>(
  myEnum: T
): [T[keyof T], ...T[keyof T][]] {
  return Object.values(myEnum).map((value: any) => `${value}`) as any;
}
// const pgTable = pgTableCreator((name) => `app_${name}`);
const pgTable = pgTableCreator((name) => `${name}`);
export const roleEnum = pgEnum("role", enumToPgEnum(Role));
export const accountTypeEnum = pgEnum(
  "account_type",
  enumToPgEnum(AccountType)
);

const updatedAt = timestamp("updated_at", { withTimezone: true })
  .defaultNow()
  .$onUpdate(() => new Date())
  .notNull();
const createdAt = timestamp("created_at", { withTimezone: true })
  .defaultNow()
  .notNull();
export const user = pgTable("user", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  name: text("name").notNull(),
  password: text("password"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
  }),
  role: roleEnum("role").default(Role.USER),
  image: text("image"),
  createdAt,
  updatedAt,
});

export const accounts = pgTable("accounts", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  userId: uuid("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  type: accountTypeEnum("account_type").notNull(),
  // type: text("type").$type<AccountType[number]>().notNull(),

  // salt: text("salt"),
  // type: text("type").notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("providerAccountId"),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: text("token_type"),
  createdAt,
  updatedAt,
});

export const reset_tokens = pgTable("reset_tokens", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  userId: uuid("userId")
    .references(() => user.id, { onDelete: "cascade" })
    .unique()
    .notNull(),
  token: text("token"),
  tokenExpiresAt: integer("token_expires_at").notNull(),
  createdAt,
  updatedAt,
});

export const verify_email_tokens = pgTable("verify_email_tokens", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  userId: uuid("userId")
    .references(() => user.id, { onDelete: "cascade" })
    .unique()
    .notNull(),
  token: text("token"),
  tokenExpiresAt: integer("token_expires_at").notNull(),
});
