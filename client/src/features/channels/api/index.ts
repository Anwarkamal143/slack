export * from "./use-create-user-channel";
export * from "./use-get-user-channels-byWorkspaceId";

export const CHANNELS_KEYS = {
  list_channels: (workspaceId?: number) => `list_channels:${workspaceId}`,
  create_channel: `channels:create`,
};

export const CHANNELS_PATHS = {};
