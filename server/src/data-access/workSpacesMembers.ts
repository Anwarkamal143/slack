import { and, db, desc, eq, getTableColumns } from "@/db/db";
import { user, workSpaceMembers, workSpaces } from "@/db/schema";
import {
  IWorkspaceMemberCreate,
  IWorkspaceMemberUpdate,
  WORKSPACE_MEMBERS_INSERT_SCHEMA,
} from "@/schemas/Workspace.schema";
import { STATUS_CODES } from "@/utils/ErrorsUtil";
import { getUserById } from "./users";
import { getWorkSpaceById } from "./workspaces";

type IPagination = {
  page: number;
  pageSize: number;
};

export const addMemberToWorkSpace = async (data: IWorkspaceMemberCreate) => {
  const result = WORKSPACE_MEMBERS_INSERT_SCHEMA.safeParse(data);
  if (result.success) {
    try {
      const workSpaceData = await db
        .insert(workSpaceMembers)
        .values(data)
        .returning();
      return { data: workSpaceData?.[0], error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.message || "Member is not added to the workspace",
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
export const updateWorkspaceMember = async (
  userId: number,
  workspaceId: number,
  data: IWorkspaceMemberUpdate
) => {
  if (!userId || !workspaceId) {
    return {
      data: null,
      error: "User and work space ID's are required",
      status: STATUS_CODES.BAD_REQUEST,
    };
  }
  const result = WORKSPACE_MEMBERS_INSERT_SCHEMA.safeParse(data);
  if (result.success) {
    const role = result.data.role;
    try {
      const workSpaceData = await db
        .update(workSpaceMembers)
        .set({ role })
        .where(
          and(
            eq(workSpaceMembers.userId, userId),
            eq(workSpaceMembers.workSpaceId, workspaceId)
          )
        )
        .returning();
      const isUpdated = workSpaceData?.[0];
      return {
        data: isUpdated,
        error: isUpdated ? null : "Member is updated",
        status: STATUS_CODES.OK,
      };
    } catch (error: any) {
      return {
        data: null,
        error: error.message || "Member is not added to the workspace",
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
export const removeMemberFromWorkSpace = async (
  data: IWorkspaceMemberCreate
) => {
  const result = WORKSPACE_MEMBERS_INSERT_SCHEMA.safeParse(data);
  if (result.success) {
    try {
      const workSpaceData = await db
        .delete(workSpaceMembers)
        .where(
          and(
            eq(workSpaceMembers.workSpaceId, data.workSpaceId as number),
            eq(workSpaceMembers.userId, data.userId as number)
          )
        )
        .returning();

      return {
        data: workSpaceData,
        error: null,
        status: STATUS_CODES.NO_CONTENT,
      };
    } catch (error: any) {
      return {
        data: null,
        error: error.message || "Member is not removed from the workspace",
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

// Get Workspaces of a Member
export const getMembersWithWorkspaces = async (
  userId: number | null = null,
  paginationProps?: IPagination
) => {
  const { page = 1, pageSize = 20 } = paginationProps || {};
  // const offset = (page - 1) * pageSize;
  const offset = (page > 0 ? page - 1 : page) * pageSize;
  try {
    const membersColumns = getTableColumns(workSpaceMembers);
    const workspacesColumns = getTableColumns(workSpaces);
    let totalRecordsPromise = null;
    let userPromise = null;

    const workSpacesQuery = db
      .select({
        ...membersColumns,
        workSpace: workspacesColumns,
      })
      .from(workSpaceMembers)
      .orderBy((fields) => desc(fields.id));
    // .orderBy((fields) => desc(fields.surrogateKey));

    if (page > 0) {
      workSpacesQuery.offset(offset);
    }
    if (pageSize > 0) {
      workSpacesQuery.limit(pageSize);
    }
    if (!userId) {
      totalRecordsPromise = db.$count(workSpaceMembers);
      workSpacesQuery.leftJoin(
        workSpaces,
        eq(workSpaces.id, workSpaceMembers.workSpaceId)
      );
      userPromise = Promise.resolve(null);
    } else {
      totalRecordsPromise = db.$count(
        workSpaceMembers,
        eq(workSpaceMembers.userId, userId)
      );
      workSpacesQuery.where((fields) => eq(fields.userId, userId));
      workSpacesQuery.innerJoin(
        workSpaces,
        eq(workSpaces.id, workSpaceMembers.workSpaceId)
      );
      userPromise = getUserById(userId);
    }

    const [totalRecords, workspacemembers, user] = await Promise.all([
      totalRecordsPromise.catch(() => 0),
      workSpacesQuery.catch(() => []),
      userPromise.catch(() => null),
    ]);
    const hasNextPage = workspacemembers.length === pageSize;
    const totalPages = Math.ceil(totalRecords / pageSize) || 0;
    const nextCursor =
      hasNextPage && workspacemembers.length > 0
        ? workspacemembers[workspacemembers.length - 1].id
        : null;
    return {
      data: {
        data: workspacemembers,
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
export const getMembersByWorkspaceId = async (
  workspaceId: number | null = null,
  paginationProps?: IPagination
) => {
  if (!workspaceId) {
    return {
      data: null,
      error: "Work space ID is required",
      status: STATUS_CODES.BAD_REQUEST,
    };
  }
  // const { page = 1, pageSize = 20 } = paginationProps || {};
  // const offset = (page - 1) * pageSize;
  const { page = 1, pageSize = 20 } = paginationProps || {};
  // const offset = (page - 1) * pageSize;
  const offset = (page > 0 ? page - 1 : page) * pageSize;
  try {
    const membersColumns = getTableColumns(workSpaceMembers);
    const { password, ...rest } = getTableColumns(user);
    // const workspacesColumns = getTableColumns(workSpaces);
    let totalRecordsPromise = null;
    const workspace = await getWorkSpaceById(workspaceId);
    if (workspace.error) {
      return {
        data: null,
        error: workspace.error || "Work space is not found",
        status: STATUS_CODES.NOT_FOUND,
      };
    }

    const workSpacesQuery = db
      .select({
        ...membersColumns,
        user: rest,
      })
      .from(workSpaceMembers)
      // .orderBy((fields) => desc(fields.createdAt));
      .orderBy((fields) => desc(fields.surrogateKey));

    if (page > 0) {
      workSpacesQuery.offset(offset);
    }
    if (pageSize > 0) {
      workSpacesQuery.limit(pageSize);
    }

    totalRecordsPromise = db.$count(
      workSpaceMembers,
      eq(workSpaceMembers.workSpaceId, workspaceId)
    );
    workSpacesQuery.where((fields) => eq(fields.workSpaceId, workspaceId));

    workSpacesQuery.leftJoin(user, eq(workSpaceMembers.userId, user.id));

    const [totalRecords, workspacemembers] = await Promise.all([
      totalRecordsPromise.catch(() => 0),
      workSpacesQuery.catch(() => []),
    ]);
    const hasNextPage = workspacemembers.length === pageSize;
    const totalPages = Math.ceil(totalRecords / pageSize) || 0;
    const nextCursor =
      hasNextPage && workspacemembers.length > 0
        ? workspacemembers[workspacemembers.length - 1].id
        : null;
    return {
      data: {
        data: workspacemembers,
        extra: workspace.data,
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

export const getMemberByUserIdAndWorkspaceId = async (
  userId: number,
  workspaceId: number
) => {
  try {
    if (!userId || !workspaceId) {
      return {
        data: null,
        error: "Work space and User ID's is required",
        status: STATUS_CODES.BAD_REQUEST,
      };
    }
    const member = await db.query.workSpaceMembers.findFirst({
      where(fields) {
        return and(
          eq(fields.userId, userId),
          eq(fields.workSpaceId, workspaceId)
        );
      },
      with: {
        workSpace: true,
        user: {
          columns: {
            password: false,
          },
        },
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
      error: "Member is not in the workspace",
      status: STATUS_CODES.INTERNAL_SERVER_ERROR,
    };
  }
};
