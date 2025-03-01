import { IPagination } from "@/@types/api";
import { WorkSpaceMemberRole } from "@/db";
import { and, db, desc, eq, gt, SQL } from "@/db/db";
import { channelMembers, channels } from "@/db/schema";
import {
  CHANNEL_INSERT_SCHEMA,
  CHANNEL_UPDATE_SCHEMA,
  IChannelCreate,
  IChannelUpdate,
} from "@/schemas/Channels.schema";
import AppError from "@/utils/appError";
import { STATUS_CODES } from "@/utils/ErrorsUtil";
import { getWorkSpaceById } from "./workspaces";

export const getChannels = async (
  workSpaceId: number | null = null,
  paginationProps?: IPagination
) => {
  // const { page = 1, pageSize = 20 } = paginationProps || {};
  // const offset = (page - 1) * pageSize;
  const { page = 1, pageSize = 20 } = paginationProps || {};
  // const offset = (page - 1) * pageSize;
  const offset = (page > 0 ? page - 1 : page) * pageSize;
  try {
    let workspace;

    if (workSpaceId) {
      workspace = await getWorkSpaceById(workSpaceId);
      if (!workspace.data) {
        return { data: null, status: workspace.status, error: workspace.error };
      }
    }
    let totalRecordsPromise = null;

    const channelsQuery = db
      .select()
      .from(channels)
      .orderBy((fields) => desc(fields.createdAt));

    if (page > 0) {
      channelsQuery.offset(offset);
    }
    if (pageSize > 0) {
      channelsQuery.limit(pageSize);
    }
    if (!workSpaceId) {
      totalRecordsPromise = db.$count(channels);
    } else {
      totalRecordsPromise = db.$count(
        channels,
        eq(channels.workSpaceId, workSpaceId)
      );
      channelsQuery.where((fields) => eq(fields.workSpaceId, workSpaceId));
    }

    const [totalRecords, channels_arr] = await Promise.all([
      totalRecordsPromise.catch(() => 0),
      channelsQuery.catch(() => []),
    ]);
    const hasNextPage = channels_arr.length === pageSize;
    const totalPages = Math.ceil(totalRecords / pageSize) || 0;
    const nextCursor =
      hasNextPage && channels_arr.length > 0
        ? // ? channels_arr[channels_arr.length - 1].id
          channels_arr[channels_arr.length - 1].id
        : null;

    return {
      data: {
        data: channels_arr,
        pagination_meta: {
          nextCursor,
          totalRecords,
          totalPages,
          hasNextPage,
          pageSize,
          page,
          nextPage: page + 1,
        },
        extra: workspace,
      },
      error: null,
      status: STATUS_CODES.OK,
    };
  } catch (error: any) {
    return {
      data: null,
      error: error.message || "channels not found",
      status: STATUS_CODES.INTERNAL_SERVER_ERROR,
    };
  }
};
export const getCursorChannels = async (
  pageSize: number = 20, // Number of records to fetch
  // cursor: string = "", // UUID of the last fetched record
  cursor: number, // UUID of the last fetched record
  workSpaceId: number
) => {
  try {
    let totalRecordsPromise = null;
    let workspace;

    if (workSpaceId) {
      workspace = await getWorkSpaceById(workSpaceId);
      if (!workspace.data) {
        return {
          data: null,
          status: workspace.status,
          error: workspace.error,
        };
      }
    }
    const channelsQuery = db
      .select()
      .from(channels)
      // .orderBy((fields) => desc(fields.id));
      .orderBy((fields) => desc(fields.surrogateKey));

    if (!!cursor) {
      channelsQuery.where((fields) => gt(fields.id, cursor));
    }
    if (pageSize > 0) {
      channelsQuery.limit(pageSize);
    }
    if (!workSpaceId) {
      totalRecordsPromise = db.$count(channels);
    } else {
      totalRecordsPromise = db.$count(
        channels,
        eq(channels.workSpaceId, workSpaceId)
      );
      channelsQuery.where((fields) => eq(fields.workSpaceId, workSpaceId));
    }
    const [totalRecords, channels_arr] = await Promise.all([
      totalRecordsPromise.catch(() => 0),
      channelsQuery.catch(() => []),
    ]);
    const hasNextPage = channels_arr.length === pageSize;
    const totalPages = Math.ceil(totalRecords / pageSize) || 0;
    const nextCursor =
      hasNextPage && channels_arr.length > 0
        ? // ? channels_arr[channels_arr.length - 1].id
          channels_arr[channels_arr.length - 1].id
        : null;
    return {
      data: {
        data: channels_arr,
        pagination_meta: {
          nextCursor,
          previousCursor: cursor,
          totalRecords,
          totalPages,
          hasNextPage,
          pageSize,
        },
        extra: workspace,
      },
      error: null,
      status: STATUS_CODES.OK,
    };
  } catch (e: any) {
    return {
      data: null,
      error: e.message || "Error while fetching channels",
      status: STATUS_CODES.INTERNAL_SERVER_ERROR,
    };
  }
};
export const getChannelsByCreatedBy = async (
  workSpaceId: number | null = null,
  createdBy?: number,
  paginationProps?: IPagination
) => {
  // const { page = 1, pageSize = 20 } = paginationProps || {};
  // const offset = (page - 1) * pageSize;
  const { page = 1, pageSize = 20 } = paginationProps || {};
  // const offset = (page - 1) * pageSize;
  const offset = (page > 0 ? page - 1 : page) * pageSize;
  try {
    let workspace;

    if (workSpaceId) {
      workspace = await getWorkSpaceById(workSpaceId);
      if (!workspace.data) {
        return { data: null, status: workspace.status, error: workspace.error };
      }
    }
    let totalRecordsPromise = null;

    const channelsQuery = db
      .select()
      .from(channels)
      .orderBy((fields) => desc(fields.createdAt));

    if (page > 0) {
      channelsQuery.offset(offset);
    }
    if (pageSize > 0) {
      channelsQuery.limit(pageSize);
    }
    let conditions: SQL<unknown> | undefined = undefined;
    if (createdBy) {
      conditions = eq(channels.createdBy, createdBy);
    }
    if (workSpaceId) {
      conditions = conditions
        ? and(conditions, eq(channels.workSpaceId, workSpaceId))
        : eq(channels.workSpaceId, workSpaceId);
    }
    channelsQuery.where(() => conditions);

    totalRecordsPromise = db.$count(channels, conditions);
    const [totalRecords, channels_arr] = await Promise.all([
      totalRecordsPromise.catch(() => 0),
      channelsQuery.catch(() => []),
    ]);
    const hasNextPage = channels_arr.length === pageSize;
    const totalPages = Math.ceil(totalRecords / pageSize) || 0;
    const nextCursor =
      hasNextPage && channels_arr.length > 0
        ? // ? channels_arr[channels_arr.length - 1].id
          channels_arr[channels_arr.length - 1].id
        : null;

    return {
      data: {
        data: channels_arr,
        pagination_meta: {
          nextCursor,
          totalRecords,
          totalPages,
          hasNextPage,
          pageSize,
          page,
          nextPage: page + 1,
        },
        extra: workspace,
      },
      error: null,
      status: STATUS_CODES.OK,
    };
  } catch (error: any) {
    return {
      data: null,
      error: error.message || "channels not found",
      status: STATUS_CODES.INTERNAL_SERVER_ERROR,
    };
  }
};
export const getChannelsByUserIdAndWorkspaceId = async (
  workSpaceId: number,
  userId: number,
  paginationProps?: IPagination
) => {
  // const { page = 1, pageSize = 20 } = paginationProps || {};
  // const offset = (page - 1) * pageSize;
  const { page = 1, pageSize = 20 } = paginationProps || {};
  // const offset = (page - 1) * pageSize;
  const offset = (page > 0 ? page - 1 : page) * pageSize;
  try {
    if (!userId || !workSpaceId) {
      return {
        status: STATUS_CODES.BAD_REQUEST,
        error: "User Id and workspace Id is required",
        data: null,
      };
    }
    let workspace;

    if (workSpaceId) {
      workspace = await getWorkSpaceById(workSpaceId);
      if (!workspace.data) {
        return { data: null, status: workspace.status, error: workspace.error };
      }
    }
    let totalRecordsPromise = null;

    const channelsQuery = db
      .select()
      .from(channels)
      .orderBy((fields) => desc(fields.createdAt));

    if (page > 0) {
      channelsQuery.offset(offset);
    }
    if (pageSize > 0) {
      channelsQuery.limit(pageSize);
    }
    let conditions: SQL<unknown> | undefined = eq(
      channels.workSpaceId,
      workSpaceId
    );

    channelsQuery.where(() => conditions);
    // channelsQuery.innerJoin(
    //   channelMembers,
    //   and(
    //     eq(channels.id, channelMembers.channelId),
    //     eq(channelMembers.userId, userId)
    //   )
    // );

    totalRecordsPromise = db.$count(channels, conditions);
    const [totalRecords, channels_arr] = await Promise.all([
      totalRecordsPromise.catch(() => 0),
      channelsQuery.catch(() => []),
    ]);
    const hasNextPage = channels_arr.length === pageSize;
    const totalPages = Math.ceil(totalRecords / pageSize) || 0;
    const nextCursor =
      hasNextPage && channels_arr.length > 0
        ? channels_arr[channels_arr.length - 1].id
        : null;
    return {
      data: {
        data: channels_arr,
        pagination_meta: {
          nextCursor,
          totalRecords,
          totalPages,
          hasNextPage,
          pageSize,
          page,
          nextPage: page + 1,
        },
        extra: workspace?.data,
      },
      error: null,
      status: STATUS_CODES.OK,
    };
  } catch (error: any) {
    return {
      data: null,
      error: error.message || "channels not found",
      status: STATUS_CODES.INTERNAL_SERVER_ERROR,
    };
  }
};
export const getChannelByWorkspaceIdChannelId = async (
  workspaceId?: number,
  channelId?: number
) => {
  if (!workspaceId || !channelId) {
    return {
      data: null,
      error: "Work space id and channel id is required!",
      status: STATUS_CODES.BAD_REQUEST,
    };
  }
  try {
    const channels = await db.query.channels.findFirst({
      where(fields, operators) {
        return operators.and(
          eq(fields.workSpaceId, workspaceId),
          eq(fields.id, channelId)
        );
      },
      //   with: {
      //     workSpace: {
      //       columns: {
      //         name: true,
      //       },
      //     },
      //   },
    });
    if (channels) {
      return { data: channels, error: null, status: STATUS_CODES.OK };
    }
    return {
      data: null,
      error: "Channel not found",
      status: STATUS_CODES.NOT_FOUND,
    };
  } catch (error: any) {
    return {
      data: null,
      error: error.message || "channels not found",
      status: STATUS_CODES.INTERNAL_SERVER_ERROR,
    };
  }
};
export const deleteChannelsByWorkspaceId = async (workspaceId?: number) => {
  if (!workspaceId) {
    return {
      data: null,
      error: "Work space  id is required!",
      status: STATUS_CODES.BAD_REQUEST,
    };
  }
  try {
    const [channel] = await db
      .delete(channels)
      .where(eq(channels.workSpaceId, workspaceId))
      .returning();
    if (!channel) {
      return {
        data: null,
        error: "Channel not deleted",
        status: STATUS_CODES.BAD_REQUEST,
      };
    }
    return {
      data: channel,
      error: null,
      status: STATUS_CODES.OK,
    };
  } catch (error: any) {
    return {
      data: null,
      error: error.message || "channels not deleted",
      status: STATUS_CODES.INTERNAL_SERVER_ERROR,
    };
  }
};
export const deleteChannelByWorkspaceIChannelId = async (
  workspaceId?: number,
  channelId?: number
) => {
  if (!workspaceId || !channelId) {
    return {
      data: null,
      error: "Work space and channel id's is required!",
      status: STATUS_CODES.BAD_REQUEST,
    };
  }
  try {
    const [channel] = await db
      .delete(channels)
      .where(
        and(eq(channels.workSpaceId, workspaceId), eq(channels.id, channelId))
      )
      .returning();
    if (!channel) {
      return {
        data: null,
        error: "Channel not deleted",
        status: STATUS_CODES.BAD_REQUEST,
      };
    }
    return {
      data: channel,
      error: null,
      status: STATUS_CODES.OK,
    };
  } catch (error: any) {
    return {
      data: null,
      error: error.message || "Channel not deleted",
      status: STATUS_CODES.INTERNAL_SERVER_ERROR,
    };
  }
};

export const updateChannelByWorkspaceIdChannelId = async (
  data: IChannelUpdate,
  workspaceId?: number,
  channelId?: number
) => {
  if (!channelId || !workspaceId) {
    return {
      data: null,
      error: "Channel and Work space id's is required!",
      status: STATUS_CODES.BAD_REQUEST,
    };
  }
  const result = CHANNEL_UPDATE_SCHEMA.safeParse(data);
  const { id, workSpaceId, surrogateKey, ...rest } = data;
  if (result.success) {
    try {
      const [channel] = await db
        .update(channels)
        .set(rest)
        .where(
          and(eq(channels.workSpaceId, workspaceId), eq(channels.id, channelId))
        )

        .returning();
      if (!channel) {
        return {
          data: null,
          error: "Channel not updated",
          status: STATUS_CODES.BAD_REQUEST,
        };
      }
      return {
        data: channel,
        error: null,
        status: STATUS_CODES.OK,
      };
    } catch (error: any) {
      return { data: null, error: error.message || "channel not updated" };
    }
  }
  return {
    data: null,
    error: result.error.errors[0].message,
    status: STATUS_CODES.BAD_REQUEST,
  };
};
export const createChannel = async (
  data: IChannelCreate,
  workspaceId?: number,
  createdBy?: number
) => {
  if (!workspaceId || !createdBy) {
    return {
      data: null,
      error: "Work space id and user Id are required!",
      status: STATUS_CODES.BAD_REQUEST,
    };
  }
  data.workSpaceId = workspaceId;
  const result = CHANNEL_INSERT_SCHEMA.safeParse(data);
  const resultData = result.data;
  if (resultData && result.success) {
    try {
      const { channel, channelMember } = await db.transaction(async (tsx) => {
        const [channel] = await tsx
          .insert(channels)
          .values({
            workSpaceId: workspaceId,
            createdBy,
            name: resultData.name.toLowerCase(),
          })

          .returning();

        if (!channel) {
          throw new AppError(
            "Channel created failed",
            STATUS_CODES.BAD_REQUEST
          );
        }
        const [channelMember] = await tsx
          .insert(channelMembers)
          .values({
            userId: channel.createdBy as number,
            role: WorkSpaceMemberRole.admin,
            channelId: channel.id,
          })
          .returning();

        if (!channelMember) {
          throw new AppError(
            "Channel created failed",
            STATUS_CODES.BAD_REQUEST
          );
        }
        return { channel, channelMember };
      });

      return {
        data: { channel, channelMember },
        error: null,
        status: STATUS_CODES.OK,
      };
    } catch (error: any) {
      return {
        data: null,
        error: error.message || "Channel not created",
        status: STATUS_CODES.BAD_REQUEST,
      };
    }
  }
  return {
    data: null,
    error: result.error.errors[0].message,
    status: STATUS_CODES.BAD_REQUEST,
  };
};

export const getChannelIfMember = async (
  channelId?: number,
  userId?: number
) => {
  if (!channelId || !userId) {
    return {
      data: null,
      error: "Channel and User id's are required!",
      status: STATUS_CODES.BAD_REQUEST,
    };
  }

  try {
    const channelMemebr = await db.query.channelMembers.findFirst({
      where(fields) {
        return and(eq(fields.userId, userId), eq(fields.channelId, channelId));
      },
      with: {
        channel: true,
      },
    });
    if (!channelMemebr) {
      return {
        data: null,
        error: "Member not found",
        status: STATUS_CODES.NOT_FOUND,
      };
    }
    return {
      data: channelMemebr,
      error: null,
      status: STATUS_CODES.OK,
    };
  } catch (error: any) {
    return {
      data: null,
      error: error.message || "You're not a member of the channel",
      status: STATUS_CODES.BAD_REQUEST,
    };
  }
};

export const getChannelById = async (channelId?: number) => {
  if (!channelId) {
    return {
      data: null,
      error: "Channel id is required!",
      status: STATUS_CODES.BAD_REQUEST,
    };
  }

  try {
    const channel = await db.query.channels.findFirst({
      where(fields) {
        return eq(fields.id, channelId);
      },
    });
    if (!channel) {
      return {
        data: null,
        error: "Channel not found",
        status: STATUS_CODES.NOT_FOUND,
      };
    }
    return {
      data: channel,
      error: null,
      status: STATUS_CODES.OK,
    };
  } catch (error: any) {
    return {
      data: null,
      error: error.message || "Channel not found",
      status: STATUS_CODES.BAD_REQUEST,
    };
  }
};
