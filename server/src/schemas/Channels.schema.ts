import { channelMembers, channels } from "@/db/schema";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import { z } from "zod";

export const CHANNEL_INSERT_SCHEMA = createInsertSchema(channels);
export const CHANNEL_SELECT_SCHEMA = createSelectSchema(channels);
export const CHANNEL_UPDATE_SCHEMA = createUpdateSchema(channels);
export const CHANNEL_MEMBERS_INSERT_SCHEMA = createInsertSchema(channelMembers);
export const CHANNEL_MEMBERS_UPDATE_SCHEMA = createUpdateSchema(channelMembers);

export type IChannelCreate = z.infer<typeof CHANNEL_INSERT_SCHEMA>;
export type IChannelSelect = z.infer<typeof CHANNEL_SELECT_SCHEMA>;
export type IChannelUpdate = z.infer<typeof CHANNEL_UPDATE_SCHEMA>;
export type IChannelMemberCreate = z.infer<
  typeof CHANNEL_MEMBERS_INSERT_SCHEMA
>;
export type IChannelMemberUpdate = z.infer<
  typeof CHANNEL_MEMBERS_UPDATE_SCHEMA
>;
