import { addMemberToChannel } from "@/data-access/channelMembers";
import {
  createChannel,
  deleteChannelByWorkspaceIChannelId,
  deleteChannelsByWorkspaceId,
  getChannelIfMember,
  getChannels,
  getChannelsByUserIdAndWorkspaceId,
  updateChannelByWorkspaceIdChannelId,
} from "@/data-access/channels";
import { WorkSpaceMemberRole } from "@/db";
import {
  IChannelCreate,
  IChannelMemberCreate,
  IChannelUpdate,
} from "@/schemas/Channels.schema";
import { safeParseInt } from "@/utils";
import AppError from "@/utils/appError";
import catchAsync from "@/utils/catchAsync";
import { STATUS_CODES } from "@/utils/ErrorsUtil";
import { response } from "@/utils/requestResponse";

export const onGetAllChannels = catchAsync(async (req, res, next) => {
  const { limit = 0, page, workspaceId = null } = req.query;
  const paginationPage = safeParseInt(page as string, 1);
  const paginationLimit = safeParseInt(limit as string, 50);
  const wsId = safeParseInt(workspaceId as string, null);
  try {
    const workspaces = await getChannels(wsId, {
      page: paginationPage,
      pageSize: paginationLimit,
    });
    if (workspaces.error) {
      return next(
        new AppError(workspaces.error || "No Data", STATUS_CODES.FORBIDDEN)
      );
    }

    return response(res, {
      message: "success",
      ...workspaces.data,
    });
  } catch {
    return next(
      new AppError("User does not exist!", STATUS_CODES.INTERNAL_SERVER_ERROR)
    );
  }
});
export const onGetChannelsByWorkspaceId = catchAsync(async (req, res, next) => {
  const { workspaceId = null } = req.query;

  if (!workspaceId) {
    next(new AppError("Workspace Id is required", STATUS_CODES.BAD_REQUEST));
  }
  return onGetAllChannels(req, res, next);
});
export const onGetUserChannelsByWorkspaceId = catchAsync(
  async (req, res, next) => {
    const { workspaceId = null } = req.query;

    if (!workspaceId) {
      next(new AppError("Workspace Id is required", STATUS_CODES.BAD_REQUEST));
    }
    const wsId = safeParseInt(workspaceId as string, null);

    if (!wsId) {
      return next(
        new AppError("Workspace Id is required", STATUS_CODES.BAD_REQUEST)
      );
    }
    const channels = await getChannelsByUserIdAndWorkspaceId(
      wsId,
      req.user?.id as number
    );
    if (channels.error) {
      return next(new AppError(channels.error || "No Data", channels.status));
    }
    return response(res, {
      message: "User channels",
      ...channels.data,
    });
  }
);

export const onDeleteWorkSpaceChannels = catchAsync(async (req, res, next) => {
  const workSpaceId = req.query.workspaceId as string;
  const channelId = req.query.channelId as string;
  let channel: any;
  const wsId = safeParseInt(workSpaceId);
  if (workSpaceId && channelId) {
    const chId = parseInt(channelId);
    channel = await deleteChannelByWorkspaceIChannelId(wsId, chId);
  } else if (workSpaceId) {
    channel = await deleteChannelsByWorkspaceId(wsId);
  }
  if (!channel.data) {
    return next(new AppError(channel.error, STATUS_CODES.BAD_REQUEST));
  }
  return response(res, {
    message: "Channels Deleted",
    data: channel.data,
  });
});
export const onDeleteChannelByWorkspacendChannelIds = catchAsync(
  async (req, res, next) => {
    const workSpaceId = req.query.workspaceId as string;
    const channelId = req.query.channelId as string;
    if (!workSpaceId || !channelId) {
      return next(
        new AppError(
          "Workspace and channel Id are required",
          STATUS_CODES.BAD_REQUEST
        )
      );
    }
    const chId = safeParseInt(channelId);
    const isMember = await getChannelIfMember(chId, req.user?.id);
    if (!isMember.data) {
      return next(
        new AppError(
          "You're not authorize to perform this operation",
          STATUS_CODES.FORBIDDEN
        )
      );
    }
    return onDeleteWorkSpaceChannels(req, res, next);
  }
);

export const onUpdateUserChannelByWorkspaceIdChannelId = catchAsync(
  async (req, res, next) => {
    const workSpaceId = req.query.workspaceId as string;
    const channelId = req.query.channelId as string;
    const workspaceChannelData = req.body as IChannelUpdate;
    const user = req.user;
    if (!workSpaceId || !channelId) {
      return next(
        new AppError(
          "Work space and channel ids are required",
          STATUS_CODES.BAD_REQUEST
        )
      );
    }
    const wsId = parseInt(workSpaceId);
    const chId = parseInt(channelId);
    const findChannel = await getChannelIfMember(chId, user?.id);
    if (!findChannel.data) {
      return next(new AppError("Channel not found", STATUS_CODES.NOT_FOUND));
    }
    const isAdmin = findChannel.data?.role === WorkSpaceMemberRole.admin;
    if (!isAdmin) {
      return next(
        new AppError(
          "You're not authorize to perform this operation",
          STATUS_CODES.FORBIDDEN
        )
      );
    }
    const channel = await updateChannelByWorkspaceIdChannelId(
      workspaceChannelData,
      wsId,
      chId
    );
    if (!channel.data) {
      return next(new AppError(channel.error, STATUS_CODES.BAD_REQUEST));
    }

    return response(res, {
      message: "Channel updated",
      data: channel.data,
    });
  }
);

export const onGetChannelByChannelId = catchAsync(async (req, res, next) => {
  const channelId = req.query.channelId as string;
  const user = req.user;
  if (!channelId) {
    return next(
      new AppError("Channel id is required", STATUS_CODES.BAD_REQUEST)
    );
  }
  const chId = parseInt(channelId);
  const findChannel = await getChannelIfMember(chId, user?.id);
  if (!findChannel.data) {
    return next(
      new AppError(
        "You're not a member of this channel",
        STATUS_CODES.NOT_FOUND
      )
    );
  }
  return response(res, {
    message: "Channel found",
    data: findChannel.data.channel,
  });
});
export const onAddMemberToChannel = catchAsync(async (req, res, next) => {
  const channelData = req.body as IChannelMemberCreate;

  const channel = await addMemberToChannel(channelData);
  if (channel.error) {
    return next(new AppError(channel.error, STATUS_CODES.BAD_REQUEST));
  }

  return response(res, {
    message: "Member added successfully.",
    data: channel.data,
    statusCode: STATUS_CODES.CREATED,
  });
});
export const onAddChannel = catchAsync(async (req, res, next) => {
  const channelData = req.body as IChannelCreate;
  const workspaceId = req.query.workspaceId as string;
  const wsId = safeParseInt(workspaceId, null);
  const userId = req.user?.id;
  if (!wsId) {
    return next(
      new AppError("Workspace Id is required", STATUS_CODES.BAD_REQUEST)
    );
  }
  const channel = await createChannel(channelData, wsId, userId);
  if (channel.error) {
    return next(new AppError(channel.error, STATUS_CODES.BAD_REQUEST));
  }

  return response(res, {
    message: "Channel created successfully.",
    data: channel.data,
    statusCode: STATUS_CODES.CREATED,
  });
});
