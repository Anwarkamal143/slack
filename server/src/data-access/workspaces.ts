import { IPagination } from "@/@types/api";
import { WorkSpaceMemberRole } from "@/db";
import { and, db, desc, eq, getTableColumns, gt } from "@/db/db";
import {
  channelMembers,
  channels,
  user,
  workSpaceMembers,
  workSpaces,
} from "@/db/schema";
import {
  IWorkspaceCreate,
  IWorkspaceUpdate,
  WORKSPACE_SCHEMA,
  WORKSPACE_UPDATE_SCHEMA,
} from "@/schemas/Workspace.schema";
import { STATUS_CODES } from "@/utils/ErrorsUtil";

export const getWorkspaces = async (
  userId: number | null = null,
  paginationProps?: IPagination
) => {
  // const { page = 1, pageSize = 20 } = paginationProps || {};
  // const offset = (page - 1) * pageSize;
  const { page = 1, pageSize = 20 } = paginationProps || {};
  // const offset = (page - 1) * pageSize;
  const offset = (page > 0 ? page - 1 : page) * pageSize;
  try {
    const workSpacesColumns = getTableColumns(workSpaces);
    const userColumns = getTableColumns(user);
    let totalRecordsPromise = null;

    const workSpacesQuery = db
      .select({
        ...workSpacesColumns,
        createdBy: userColumns.name,
      })
      .from(workSpaces)
      .orderBy((fields) => desc(fields.createdAt));

    if (page > 0) {
      workSpacesQuery.offset(offset);
    }
    if (pageSize > 0) {
      workSpacesQuery.limit(pageSize);
    }
    if (!userId) {
      totalRecordsPromise = db.$count(workSpaces);
      workSpacesQuery.leftJoin(user, eq(workSpaces.userId, user.id));
    } else {
      totalRecordsPromise = db.$count(
        workSpaces,
        eq(workSpaces.userId, userId)
      );
      workSpacesQuery.where((fields) => eq(fields.userId, userId));
      workSpacesQuery.innerJoin(user, eq(workSpaces.userId, user.id));
    }

    const [totalRecords, workspaces] = await Promise.all([
      totalRecordsPromise.catch(() => 0),
      workSpacesQuery.catch(() => []),
    ]);
    const hasNextPage = workspaces.length === pageSize;
    const totalPages = Math.ceil(totalRecords / pageSize) || 0;
    const nextCursor =
      hasNextPage && workspaces.length > 0
        ? workspaces[workspaces.length - 1].id
        : null;
    return {
      data: {
        data: workspaces,
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
export const getCursorWorkspaces = async (
  pageSize: number = 20, // Number of records to fetch
  // cursor: string = "", // UUID of the last fetched record
  cursor: number, // UUID of the last fetched record
  userId: number
) => {
  try {
    let totalRecordsPromise = null;
    const workSpacesQuery = db
      .select()
      .from(workSpaces)
      // .orderBy((fields) => desc(fields.id));
      .orderBy((fields) => desc(fields.surrogateKey));

    if (!!cursor) {
      workSpacesQuery.where((fields) => gt(fields.id, cursor));
      // workSpacesQuery.where((fields) => gt(fields.surrogateKey, cursor));
    }
    if (pageSize > 0) {
      workSpacesQuery.limit(pageSize);
    }
    if (!userId) {
      totalRecordsPromise = db.$count(workSpaces);
      workSpacesQuery.leftJoin(user, eq(workSpaces.userId, user.id));
    } else {
      totalRecordsPromise = db.$count(
        workSpaces,
        eq(workSpaces.userId, userId)
      );
      workSpacesQuery.where((fields) => eq(fields.userId, userId));
      workSpacesQuery.innerJoin(user, eq(user.id, workSpaces.userId));
    }
    const [totalRecords, workspaces] = await Promise.all([
      totalRecordsPromise.catch(() => 0),
      workSpacesQuery.catch(() => []),
    ]);
    const hasNextPage = workspaces.length === pageSize;
    const totalPages = Math.ceil(totalRecords / pageSize) || 0;
    const nextCursor =
      hasNextPage && workspaces.length > 0
        ? workspaces[workspaces.length - 1].id
        : null;
    return {
      data: {
        data: workspaces,
        pagination_meta: {
          nextCursor,
          previousCursor: cursor,
          totalRecords,
          totalPages,
          hasNextPage,
          pageSize,
        },
      },
      error: null,
      status: STATUS_CODES.OK,
    };
  } catch (e: any) {
    return {
      data: null,
      error: e.message || "Error while fetching workspaces",
      status: STATUS_CODES.INTERNAL_SERVER_ERROR,
    };
  }
};

export const createWorkSpace = async (data: IWorkspaceCreate) => {
  const result = WORKSPACE_SCHEMA.safeParse(data);
  if (!result.success) {
    return {
      error: result.error?.errors[0].message,
      data: null,
      status: STATUS_CODES.BAD_REQUEST,
    };
  }

  const { name, ...rest } = result.data;
  try {
    const { workspace, member, channel, channelMember } = await db.transaction(
      async (tx) => {
        const [workspace] = await tx
          .insert(workSpaces)
          .values({ ...rest, name: name?.toLowerCase() })
          .returning();

        if (!workspace) {
          throw new Error("Workspace creation failed");
        }

        const [member] = await tx
          .insert(workSpaceMembers)
          .values({
            userId: rest.userId,
            workSpaceId: workspace.id,
            role: WorkSpaceMemberRole.admin,
          })
          .returning();

        if (!member) {
          throw new Error("Workspace creation failed");
        }
        const [channel] = await tx
          .insert(channels)
          .values({
            name: "general",
            isPrivate: false,
            workSpaceId: workspace.id,
            createdBy: rest.userId,
          })
          .returning();
        if (!channel) {
          throw new Error("Workspace creation failed");
        }
        const [channelMember] = await tx.insert(channelMembers).values({
          userId: rest.userId,
          channelId: channel.id,
          role: WorkSpaceMemberRole.admin,
        });
        if (!channelMember) {
          throw new Error("Workspace creation failed");
        }
        return { workspace, member, channel, channelMember };
      }
    );

    return {
      data: {
        ...member,
        workSpace: workspace,
        channel: channel,
        channelMember: channelMember,
      },
      error: null,
      status: STATUS_CODES.OK,
    };
  } catch (error: any) {
    return {
      data: null,
      error: error.message || "WorkSpace not created",
      status: STATUS_CODES.INTERNAL_SERVER_ERROR,
    };
  }
};

export const getWorkSpaceById = async (workspaceId?: number) => {
  if (!workspaceId) {
    return {
      data: null,
      error: "Work space id is required!",
      status: STATUS_CODES.BAD_REQUEST,
    };
  }
  try {
    const workSpaceData = await db.query.workSpaces.findFirst({
      where(fields) {
        return eq(fields.id, workspaceId);
      },
      with: {
        user: true,
      },
    });
    if (!workSpaceData) {
      return {
        data: null,
        error: "Workspace not found",
        status: STATUS_CODES.NOT_FOUND,
      };
    }
    return { data: workSpaceData, error: null, status: STATUS_CODES.OK };
  } catch (error: any) {
    return {
      data: null,
      error: error.message || "WorkSpace not found",
      status: STATUS_CODES.INTERNAL_SERVER_ERROR,
    };
  }
};
export const deleteWorkSpaceById = async (workspaceId?: number) => {
  if (!workspaceId) {
    return {
      data: null,
      error: "Work space id is required!",
      status: STATUS_CODES.BAD_REQUEST,
    };
  }
  try {
    const [workspace] = await db
      .delete(workSpaces)
      .where(eq(workSpaces.id, workspaceId))
      .returning();
    if (!workspace) {
      return {
        data: null,
        error: "Workspace not deleted",
        status: STATUS_CODES.BAD_REQUEST,
      };
    }
    return {
      data: workspace,
      error: null,
      status: STATUS_CODES.OK,
    };
  } catch (error: any) {
    return {
      data: null,
      error: error.message || "WorkSpace not deleted",
      status: STATUS_CODES.INTERNAL_SERVER_ERROR,
    };
  }
};

export const updateWorkSpaceById = async (
  data: IWorkspaceCreate,
  workSpaceId: number
) => {
  if (!workSpaceId) {
    return {
      data: null,
      error: "Work space id is required!",
      status: STATUS_CODES.BAD_REQUEST,
    };
  }
  const result = WORKSPACE_UPDATE_SCHEMA.safeParse(data);
  if (result.success) {
    try {
      const [workspace] = await db
        .update(workSpaces)
        .set(data)
        .where(eq(workSpaces.id, workSpaceId))
        .returning();
      if (!workspace) {
        return {
          data: null,
          error: "Workspace not updated",
          status: STATUS_CODES.BAD_REQUEST,
        };
      }
      return {
        data: workspace,
        error: null,
        status: STATUS_CODES.OK,
      };
    } catch (error: any) {
      return {
        data: null,
        error: error.message || "WorkSpace not updated",
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

export const getUserWorkSpaceById = async (
  userId?: number,
  workspaceId?: number
) => {
  if (!userId || !workspaceId) {
    return {
      data: null,
      error: "User ID and Work space id is required!",
      status: STATUS_CODES.BAD_REQUEST,
    };
  }
  try {
    const workSpaceData = await db.query.workSpaces.findFirst({
      where(fields, operators) {
        return operators.and(
          eq(fields.id, workspaceId),
          eq(fields.userId, userId)
        );
      },
      with: {
        channels: true,
        user: {
          columns: {
            name: true,
          },
        },
      },
    });
    if (!workSpaceData) {
      return {
        data: null,
        error: "Workspace not found",
        status: STATUS_CODES.NOT_FOUND,
      };
    }
    return {
      data: workSpaceData,
      error: null,
      status: STATUS_CODES.OK,
    };
  } catch (error: any) {
    return {
      data: null,
      error: error.message || "WorkSpace not found",
      status: STATUS_CODES.INTERNAL_SERVER_ERROR,
    };
  }
};

export const deleteUserWorkSpaceById = async (
  userId: number | undefined,
  workspaceId: number
) => {
  if (!userId || !workspaceId) {
    return {
      data: null,
      error: "User ID and Work space id is required!",
      status: STATUS_CODES.BAD_REQUEST,
    };
  }
  try {
    const [workspace] = await db
      .delete(workSpaces)
      .where(and(eq(workSpaces.id, workspaceId), eq(workSpaces.userId, userId)))
      .returning();
    if (!workspace) {
      return {
        data: null,
        error: "Workspace not deleted",
        status: STATUS_CODES.BAD_REQUEST,
      };
    }
    return {
      data: workspace,
      error: null,
      status: STATUS_CODES.OK,
    };
  } catch (error: any) {
    return {
      data: null,
      error: error.message || "WorkSpace not deleted",
      status: STATUS_CODES.INTERNAL_SERVER_ERROR,
    };
  }
};

export const updateUserWorkSpaceById = async (
  data: IWorkspaceUpdate,
  userId?: number,
  workspaceId?: number
) => {
  if (!userId || !workspaceId) {
    return {
      data: null,
      error: "User ID and Work space id is required!",
      status: STATUS_CODES.BAD_REQUEST,
    };
  }
  const result = WORKSPACE_UPDATE_SCHEMA.safeParse(data);
  if (result.success) {
    try {
      const [workspace] = await db
        .update(workSpaces)
        .set(data)
        .where(
          and(eq(workSpaces.id, workspaceId), eq(workSpaces.userId, userId))
        )
        .returning();
      if (!workspace) {
        return {
          data: null,
          error: "Workspace not deleted",
          status: STATUS_CODES.BAD_REQUEST,
        };
      }
      return { data: workspace, error: null, status: STATUS_CODES.OK };
    } catch (error: any) {
      return {
        data: null,
        error: error.message || "WorkSpace not updated",
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
