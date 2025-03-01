import { channelMembers, channels } from "@/lib/drizzle/schema/schema";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import { z } from "zod";

/*

    name: text(),
    userId: uuid().notNull(),
    joinCode: text(),
*/
export const CHANNELS_UPDATE_SCEHEMA = createUpdateSchema(channels, {
  name: z
    .string()
    .min(1, "Name is required")
    .min(3, "Name must be 3 charactors long"),
});

export const CHANNELS_CREATE_SCEHEMA = createInsertSchema(channels);
export const CHANNELS_SELECT_SCEHEMA = createSelectSchema(channels);
export const MEMBER_CREATE_SCEHEMA = createInsertSchema(channelMembers);
export const MEMBER_UPDATE_SCEHEMA = createUpdateSchema(channelMembers);
export const MEMBER_SELECT_SCEHEMA = createSelectSchema(channelMembers);
export const CREATE_WORK_SPACE_SCHEMA = z.object({
  name: z
    .string()
    .min(1, "Channel name is required")
    .min(3, "Channel name must be 3 charactors long.")
    .max(70, "Channel name must be less than 70 charactors long."),
});

export type IChannelUpdate = z.infer<typeof CHANNELS_UPDATE_SCEHEMA>;
export type IChannel = z.infer<typeof CHANNELS_SELECT_SCEHEMA>;
export type IChannelInsert = z.infer<typeof CHANNELS_CREATE_SCEHEMA>;
export type IChannelMember = z.infer<typeof MEMBER_SELECT_SCEHEMA>;
export type IMemberChannels = IChannelMember & {
  channel: IChannel;
};
export type ICreateChannle = {
  channel: IChannel;
  channelMember: IChannelMember;
};
