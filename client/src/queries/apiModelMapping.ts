import { IChannel, IChannelMember } from "@/features/channels/schema";
import { IWorkSpace, IWorkspaceMember } from "@/features/workspaces/schemas";
import AuthModel from "@/models/Auth.model";
import ChannelsModel from "@/models/Channels.model";
import UserModel from "@/models/User.model";
import WorkspaceMembersModel from "@/models/WorkspaceMembers.model";
import WorkspacesModel from "@/models/Workspaces.model";
import { IAppUser } from "@/schema/user";
import { UnionIfBPresent } from "@/types/query";

export const ApiModels = {
  Auth: "auth",
  User: "user",
  Workspaces: "workSpaces",
  WorkspaceMembers: "workspaceMembers",
  Channels: "channels",
  ChannelMembers: "channelMembers",
} as const;

export const ThreePAppSubModels = {
  SlackClone: "Slack_Clone",
} as const;

export const ApiModelMapping = {
  [ApiModels.Auth]: {
    model: AuthModel,
  },
  [ApiModels.Workspaces]: {
    model: WorkspacesModel,
  },
  [ApiModels.User]: {
    model: UserModel,
  },
  [ApiModels.WorkspaceMembers]: {
    model: WorkspaceMembersModel,
  },
  [ApiModels.Channels]: {
    model: ChannelsModel,
  },
  [ApiModels.ChannelMembers]: {
    model: WorkspaceMembersModel,
  },
} as const;

// export type ApiModelDataTypes = {
//   [ApiModels.Auth]: IAppUser;
//   [ApiModels.Workspaces]: IWorkSpace;
//   [ApiModels.User]: IWorkSpace;
//   [ApiModels.Members]: IWorkspaceMember;
// };
export type ApiModelDataTypes<T = never> = {
  [ApiModels.Auth]: UnionIfBPresent<IAppUser, T>;
  [ApiModels.Workspaces]: UnionIfBPresent<IWorkSpace, T>;
  [ApiModels.User]: UnionIfBPresent<IWorkSpace, T>;
  [ApiModels.WorkspaceMembers]: UnionIfBPresent<IWorkspaceMember, T>;
  [ApiModels.Channels]: UnionIfBPresent<IChannel, T>;
  [ApiModels.ChannelMembers]: UnionIfBPresent<IChannelMember, T>;
};

export type RequestOptions = {
  query?: Record<string, any>;
  path?: string | undefined;
};
