import { and, db, desc, eq, getTableColumns } from "@/db/db";
import { channelMembers, channels, user } from "@/db/schema";

import {
  CHANNEL_MEMBERS_INSERT_SCHEMA,
  IChannelMemberCreate,
  IChannelMemberUpdate,
} from "@/schemas/Channels.schema";
import { STATUS_CODES } from "@/utils/ErrorsUtil";
import { getChannelById } from "./channels";
import { getUserById } from "./users";

type IPagination = {
  page: number;
  pageSize: number;
};

export const addMemberToChannel = async (data: IChannelMemberCreate) => {
  const result = CHANNEL_MEMBERS_INSERT_SCHEMA.safeParse(data);
  if (result.success) {
    try {
      const channelData = await db
        .insert(channelMembers)
        .values(data)
        .returning();
      return { data: channelData?.[0], error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.message || "Member is not added to the channel",
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
      };
    }
  }
  return {
    data: null,
    error: result.error.errors[0].message,
    status: STATUS_CODES.BAD_REQUEST,
  };
};
export const updateChannelMemberByUserIdChannelId = async (
  channelId: number,
  userId: number,
  data: IChannelMemberUpdate
) => {
  if (!channelId || !userId) {
    return {
      data: null,
      error: "User and work space ID's are required",
      status: STATUS_CODES.BAD_REQUEST,
    };
  }
  const result = CHANNEL_MEMBERS_INSERT_SCHEMA.safeParse(data);
  if (result.success) {
    const role = result.data.role;
    try {
      const channelData = await db
        .update(channelMembers)
        .set({ role })
        .where(
          and(
            eq(channelMembers.channelId, channelId),
            eq(channelMembers.userId, userId)
          )
        )
        .returning();
      const isUpdated = channelData?.[0];
      return {
        data: isUpdated,
        error: isUpdated ? null : "Member updated",
        status: STATUS_CODES.OK,
      };
    } catch (error: any) {
      return {
        data: null,
        error: error.message || "Member is not updated",
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
      };
    }
  }
  return {
    data: null,
    error: result.error.errors[0].message,
    status: STATUS_CODES.BAD_REQUEST,
  };
};
export const updateChannelMembersByChannelId = async (
  channelId: number,
  data: IChannelMemberUpdate
) => {
  if (!channelId) {
    return {
      data: null,
      error: "Channel id is required",
      status: STATUS_CODES.BAD_REQUEST,
    };
  }
  const result = CHANNEL_MEMBERS_INSERT_SCHEMA.safeParse(data);
  if (result.success) {
    const role = result.data.role;
    try {
      const channelData = await db
        .update(channelMembers)
        .set({ role })
        .where(eq(channelMembers.channelId, channelId))
        .returning();
      const isUpdated = channelData?.[0];
      return {
        data: isUpdated,
        error: isUpdated ? null : "Member updated",
        status: STATUS_CODES.OK,
      };
    } catch (error: any) {
      return {
        data: null,
        error: error.message || "Member is not updated",
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
      };
    }
  }
  return {
    data: null,
    error: result.error.errors[0].message,
    status: STATUS_CODES.BAD_REQUEST,
  };
};
export const updateChannelMembersByUserId = async (
  userId: number,
  data: IChannelMemberUpdate
) => {
  if (!userId) {
    return {
      data: null,
      error: "User id is required",
      status: STATUS_CODES.BAD_REQUEST,
    };
  }
  const result = CHANNEL_MEMBERS_INSERT_SCHEMA.safeParse(data);
  if (result.success) {
    const role = result.data.role;
    try {
      const channelData = await db
        .update(channelMembers)
        .set({ role })
        .where(eq(channelMembers.userId, userId))
        .returning();
      const isUpdated = channelData?.[0];
      return {
        data: isUpdated,
        error: isUpdated ? null : "Member updated",
        status: STATUS_CODES.OK,
      };
    } catch (error: any) {
      return {
        data: null,
        error: error.message || "Member is not updated",
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
      };
    }
  }
  return {
    data: null,
    error: result.error.errors[0].message,
    status: STATUS_CODES.BAD_REQUEST,
  };
};
export const removeMemberFromChannel = async (
  channelId?: number,
  userId?: number
) => {
  if (!channelId || !userId) {
    return {
      data: null,
      error: "Channel and User id's are required",
      status: STATUS_CODES.BAD_REQUEST,
    };
  }

  try {
    const channelMemebrdata = await db
      .delete(channelMembers)
      .where(
        and(
          eq(channelMembers.channelId, channelId),
          eq(channelMembers.userId, userId)
        )
      )
      .returning();

    return {
      data: channelMemebrdata?.[0],
      error: null,
      status: STATUS_CODES.NO_CONTENT,
    };
  } catch (error: any) {
    return {
      data: null,
      error: error.message || "Member is not removed from the channel",
      status: STATUS_CODES.INTERNAL_SERVER_ERROR,
    };
  }
};

// Get Workspaces of a Member
export const getMembersWithChannels = async (
  userId: number | null = null,
  paginationProps?: IPagination
) => {
  const { page = 1, pageSize = 20 } = paginationProps || {};
  // const offset = (page - 1) * pageSize;
  const offset = (page > 0 ? page - 1 : page) * pageSize;
  try {
    const channelsMembersColumns = getTableColumns(channelMembers);
    const channelsColumns = getTableColumns(channels);
    let totalRecordsPromise = null;
    let userPromise = null;

    const channelMembersQuery = db
      .select({
        ...channelsMembersColumns,
        workSpace: channelsColumns,
      })
      .from(channelMembers)
      .orderBy((fields) => desc(fields.id));
    // .orderBy((fields) => desc(fields.surrogateKey));

    if (page > 0) {
      channelMembersQuery.offset(offset);
    }
    if (pageSize > 0) {
      channelMembersQuery.limit(pageSize);
    }
    if (!userId) {
      totalRecordsPromise = db.$count(channelMembers);
      channelMembersQuery.leftJoin(
        channels,
        eq(channels.id, channelMembers.channelId)
      );
      userPromise = Promise.resolve(null);
    } else {
      totalRecordsPromise = db.$count(
        channelMembers,
        eq(channelMembers.userId, userId)
      );
      channelMembersQuery.where((fields) => eq(fields.userId, userId));
      channelMembersQuery.innerJoin(
        channels,
        eq(channels.id, channelMembers.channelId)
      );
      userPromise = getUserById(userId);
    }

    const [totalRecords, channelmembers, user] = await Promise.all([
      totalRecordsPromise.catch(() => 0),
      channelMembersQuery.catch(() => []),
      userPromise.catch(() => null),
    ]);
    const hasNextPage = channelmembers.length === pageSize;
    const totalPages = Math.ceil(totalRecords / pageSize) || 0;
    const nextCursor =
      hasNextPage && channelmembers.length > 0
        ? channelmembers[channelmembers.length - 1].id
        : null;
    return {
      data: {
        data: channelmembers,
        extra: user?.data,
        pagination_meta: {
          nextCursor,
          totalRecords,
          totalPages,
          hasNextPage,
          pageSize,
          page,
          nextPage: page + 1,
        },
      },
      error: null,
      status: STATUS_CODES.OK,
    };
  } catch (e: any) {
    return {
      data: null,
      error: e.message || "No data",
      status: STATUS_CODES.INTERNAL_SERVER_ERROR,
    };
  }
};
// Get Members of a Workspace
export const getMembersByChannelId = async (
  channelId: number | null = null,
  paginationProps?: IPagination
) => {
  if (!channelId) {
    return {
      data: null,
      error: "Channel ID is required",
      status: STATUS_CODES.BAD_REQUEST,
    };
  }
  // const { page = 1, pageSize = 20 } = paginationProps || {};
  // const offset = (page - 1) * pageSize;
  const { page = 1, pageSize = 20 } = paginationProps || {};
  // const offset = (page - 1) * pageSize;
  const offset = (page > 0 ? page - 1 : page) * pageSize;
  try {
    const membersColumns = getTableColumns(channelMembers);
    const { password, ...rest } = getTableColumns(user);
    // const workspacesColumns = getTableColumns(workSpaces);
    let totalRecordsPromise = null;
    const channel = await getChannelById(channelId);
    if (channel.error) {
      return {
        data: null,
        error: channel.error || "Channel not found",
        status: STATUS_CODES.NOT_FOUND,
      };
    }

    const channelMembersQuery = db
      .select({
        ...membersColumns,
        user: rest,
      })
      .from(channelMembers)
      // .orderBy((fields) => desc(fields.createdAt));
      .orderBy((fields) => desc(fields.surrogateKey));

    if (page > 0) {
      channelMembersQuery.offset(offset);
    }
    if (pageSize > 0) {
      channelMembersQuery.limit(pageSize);
    }

    totalRecordsPromise = db.$count(
      channelMembers,
      eq(channelMembers.channelId, channelId)
    );
    channelMembersQuery.where((fields) => eq(fields.channelId, channelId));

    channelMembersQuery.leftJoin(user, eq(channelMembers.userId, user.id));

    const [totalRecords, channelmembers] = await Promise.all([
      totalRecordsPromise.catch(() => 0),
      channelMembersQuery.catch(() => []),
    ]);
    const hasNextPage = channelmembers.length === pageSize;
    const totalPages = Math.ceil(totalRecords / pageSize) || 0;
    const nextCursor =
      hasNextPage && channelmembers.length > 0
        ? channelmembers[channelmembers.length - 1].id
        : null;
    return {
      data: {
        data: channelmembers,
        extra: channel.data,
        pagination_meta: {
          nextCursor,
          totalRecords,
          totalPages,
          hasNextPage,
          pageSize,
          page,
          nextPage: page + 1,
        },
      },
      error: null,
      status: STATUS_CODES.OK,
    };
  } catch (e: any) {
    return {
      data: null,
      error: e.message || "No data",
      status: STATUS_CODES.INTERNAL_SERVER_ERROR,
    };
  }
};

export const getMemberByUserIdAndChannelId = async (
  userId: number,
  channelId: number
) => {
  try {
    if (!userId || !channelId) {
      return {
        data: null,
        error: "Channel and User ID's is required",
        status: STATUS_CODES.BAD_REQUEST,
      };
    }
    const member = await db.query.channelMembers.findFirst({
      where(fields) {
        return and(eq(fields.userId, userId), eq(fields.channelId, channelId));
      },
      with: {
        channel: true,
      },
    });
    if (!member) {
      return {
        data: null,
        error: "Member not found",
        status: STATUS_CODES.NOT_FOUND,
      };
    }
    return { data: member, error: null, status: STATUS_CODES.OK };
  } catch (error) {
    return {
      data: null,
      error: "Member is not in the channel",
      status: STATUS_CODES.INTERNAL_SERVER_ERROR,
    };
  }
};
