import { boolean, pgEnum, timestamp } from "drizzle-orm/pg-core";
import {
  AccountType,
  Role,
  WorkSpaceMemberRole,
  WorkspacePublishStatuses,
} from ".";

// export function enumToPgEnum<T extends Record<string, any>>(
//   myEnum: T
// ): [T[keyof T], ...T[keyof T][]] {
//   return Object.values(myEnum).map((value: any) => `${value}`) as any;
// }
// const pgTable = pgTableCreator((name) => `app_${name}`);
export const roleEnum = pgEnum("role", [Role.ADMIN, Role.USER]);

export const workSpaceMemberRoleEnum = pgEnum("workspaceMemberRole", [
  WorkSpaceMemberRole.admin,
  WorkSpaceMemberRole.guest,
  WorkSpaceMemberRole.member,
  WorkSpaceMemberRole.moderator,
]);
export const accountTypeEnum = pgEnum("accountType", [
  AccountType.email,
  AccountType.oauth,
]);

export const workspacePublishStatuses = pgEnum("workspacePublishStatuses", [
  WorkspacePublishStatuses.draft,
  WorkspacePublishStatuses.private,
  WorkspacePublishStatuses.public,
]);
// export const workspaceChannelPublishStatuses = pgEnum(
//   "workspace_channel_publish_statuses",
//   [
//     WorkspaceChannelPublishStatuses.draft,
//     WorkspaceChannelPublishStatuses.private,
//     WorkspaceChannelPublishStatuses.public,
//   ]
// );
export const isActive = boolean("is_active").default(true).notNull();

export const timeStamps = {
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
};
