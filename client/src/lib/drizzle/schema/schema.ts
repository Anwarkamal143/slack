import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

export const role = pgEnum("role", ["user", "admin"]);
export const type = pgEnum("type", ["oauth", "email"]);

export const verifyEmailTokens = pgTable(
  "verify_email_tokens",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    userId: uuid("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    token: text("token"),
    tokenExpiresAt: integer("token_expires_at").notNull(),
  },
  (table) => {
    return {
      verifyEmailTokensUserIdUnique: unique(
        "verify_email_tokens_userId_unique"
      ).on(table.userId),
    };
  }
);

export const user = pgTable(
  "user",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    email: text("email").notNull(),
    emailVerified: timestamp("emailVerified", { mode: "string" }),
    role: role("role").default("user"),
  },
  (table) => {
    return {
      userEmailUnique: unique("user_email_unique").on(table.email),
    };
  }
);

export const accounts = pgTable("accounts", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  userId: uuid("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  password: text("password"),
  type: text("type").notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("providerAccountId"),
  refreshToken: text("refresh_token"),
  accessToken: text("access_token"),
  expiresAt: integer("expires_at"),
  tokenType: text("token_type"),
});

export const profile = pgTable(
  "profile",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    userId: uuid("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    name: text("name"),
    imageId: text("image_id"),
    image: text("image"),
    bio: text("bio").default("").notNull(),
  },
  (table) => {
    return {
      profileUserIdUnique: unique("profile_userId_unique").on(table.userId),
    };
  }
);

export const resetTokens = pgTable(
  "reset_tokens",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    userId: uuid("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    token: text("token"),
    tokenExpiresAt: integer("token_expires_at").notNull(),
  },
  (table) => {
    return {
      resetTokensUserIdUnique: unique("reset_tokens_userId_unique").on(
        table.userId
      ),
    };
  }
);
