import {
  addMemberToWorkSpace,
  getMemberByUserIdAndWorkspaceId,
  getMembersByWorkspaceId,
  getMembersWithWorkspaces,
  removeMemberFromWorkSpace,
  updateWorkspaceMember,
} from "@/data-access/workSpacesMembers";
import { WorkSpaceMemberRole } from "@/db";
import {
  IWorkspaceMemberCreate,
  IWorkspaceMemberUpdate,
} from "@/schemas/Workspace.schema";
import AppError from "@/utils/appError";
import catchAsync from "@/utils/catchAsync";
import { STATUS_CODES } from "@/utils/ErrorsUtil";
import { response } from "@/utils/requestResponse";

// Admin Routes
export const onGetMembers = catchAsync(async (req, res, next) => {
  const { limit = 0, page, userId = "", workspaceId = "" } = req.query;
  const paginationPage = parseInt((page as string) || "1", 10);
  const paginationLimit = parseInt((limit as string) || "50", 10);
  try {
    let workspaces:
      | Awaited<ReturnType<typeof getMembersByWorkspaceId>>
      | Awaited<ReturnType<typeof getMembersWithWorkspaces>>;
    const paginationProps = {
      page: paginationPage,
      pageSize: paginationLimit,
    };
    const wsId = parseInt(workspaceId as string);
    const uId = parseInt(userId as string);
    workspaces = workspaceId
      ? await getMembersByWorkspaceId(wsId, paginationProps)
      : await getMembersWithWorkspaces(uId, paginationProps);

    if (workspaces.error) {
      return next(
        new AppError(workspaces.error || "No Data", STATUS_CODES.NO_CONTENT)
      );
    }

    return response(res, {
      message: "success",
      ...workspaces.data,
    });
  } catch {
    return next(
      new AppError("Internal Server Error", STATUS_CODES.INTERNAL_SERVER_ERROR)
    );
  }
});

export const onGetMembersByWorkspaceId = catchAsync(async (req, res, next) => {
  const { workspaceId = null } = req.query;
  if (!workspaceId) {
    return next(
      new AppError("Work space ID is required", STATUS_CODES.BAD_REQUEST)
    );
  }
  return onGetMembers(req, res, next);
});
export const onAddMemberToWorkSpace = catchAsync(async (req, res, next) => {
  const workSpaceData = req.body as IWorkspaceMemberCreate;

  const workspace = await addMemberToWorkSpace(workSpaceData);
  if (workspace.error) {
    return next(new AppError(workspace.error, STATUS_CODES.BAD_REQUEST));
  }

  return response(res, {
    message: "Work space created successfully.",
    data: workspace.data,
    statusCode: STATUS_CODES.CREATED,
  });
});
export const onRemoveMemberFromWorkSpace = catchAsync(
  async (req, res, next) => {
    const { workspaceId = "", userId = "" } = req.query;
    const wsId = parseInt(workspaceId as string);
    const uId = parseInt(userId as string);
    const workspace = await removeMemberFromWorkSpace({
      userId: uId,
      workSpaceId: wsId,
    });
    if (workspace.error) {
      return next(new AppError(workspace.error, workspace.status));
    }
    return response(res, {
      message: "Work Space removed",
      data: workspace.data,
      statusCode: STATUS_CODES.NO_CONTENT,
    });
  }
);

export const onUpdateWorkspaceMember = catchAsync(async (req, res, next) => {
  const workSpaceData = req.body as IWorkspaceMemberUpdate;
  const userId = req.query.userId as string;
  const workspaceId = req.query.workspaceId as string;
  const wsId = parseInt(workspaceId as string);
  const uId = parseInt(userId as string);
  const workspace = await updateWorkspaceMember(uId, wsId, workSpaceData);
  if (workspace.error) {
    return next(new AppError(workspace.error, STATUS_CODES.BAD_REQUEST));
  }

  return response(res, {
    message: "Work space updated successfully.",
    data: workspace.data,
  });
});

// User Routes

export const onGetMembersByWorkspaceIdIfIsMember = catchAsync(
  async (req, res, next) => {
    const reqUserId = req.user?.id;
    const workspaceId = req.query.workspaceId as string;
    if (!workspaceId) {
      return next(
        new AppError("Work space ID is required", STATUS_CODES.FORBIDDEN)
      );
    }
    const wsId = parseInt(workspaceId as string);
    const isMember = await getMemberByUserIdAndWorkspaceId(
      reqUserId as number,
      wsId
    );
    if (!isMember.data) {
      return next(
        new AppError(
          isMember.error || "User is not a member of this workspace",
          STATUS_CODES.FORBIDDEN
        )
      );
    }
    return onGetMembers(req, res, next);
  }
);
export const onAddUserMemberToWorkSpaceIfAdmin = catchAsync(
  async (req, res, next) => {
    const workSpaceData = req.body as IWorkspaceMemberCreate;
    const reqUserId = req.user?.id as number;
    if (!workSpaceData.workSpaceId) {
      return next(
        new AppError("WorkspaceId is required", STATUS_CODES.BAD_REQUEST)
      );
    }
    const workspaceMembers = await getMemberByUserIdAndWorkspaceId(
      reqUserId,
      workSpaceData.workSpaceId
    );

    if (
      !workspaceMembers.data ||
      workspaceMembers.data.role !== WorkSpaceMemberRole.admin
    ) {
      return next(
        new AppError(
          "Your'e not authorize to perform this operation",
          STATUS_CODES.UNAUTHORIZED
        )
      );
    }
    const workspace = await addMemberToWorkSpace(workSpaceData);
    if (workspace.error) {
      return next(new AppError(workspace.error, STATUS_CODES.BAD_REQUEST));
    }

    return response(res, {
      message: "Work space created successfully.",
      data: workspace.data,
    });
  }
);
export const onGetMembersByUserIdIfIsMember = catchAsync(
  async (req, res, next) => {
    const userId = req.user?.id + "";

    if (!userId) {
      return next(
        new AppError("User ID is required", STATUS_CODES.BAD_REQUEST)
      );
    }
    req.query.workspaceId = "";
    req.query.userId = userId;
    return onGetMembers(req, res, next);
  }
);

export const onRemoveUserMemberFromWorkSpace = catchAsync(
  async (req, res, next) => {
    try {
      const reqUserId = req.user?.id as number;
      const workspaceId = req.query.workspaceId as string;
      const userId = req.query.userId as string;
      const wsId = parseInt(workspaceId as string);
      // const uId = parseInt(reqUserId as string);
      if (!workspaceId) {
        return next(
          new AppError("Work space ID is required", STATUS_CODES.BAD_REQUEST)
        );
      }
      const isMember = await getMemberByUserIdAndWorkspaceId(reqUserId, wsId);
      if (!isMember.data) {
        return next(
          new AppError(
            isMember.error || "User is not a member of this workspace",
            STATUS_CODES.FORBIDDEN
          )
        );
      }
      // workspace admin wants to remove the user;
      if (userId && isMember.data?.role !== WorkSpaceMemberRole.admin) {
        return next(
          new AppError(
            "You're not authorize to perform this operation",
            STATUS_CODES.FORBIDDEN
          )
        );
      }
      req.query.userId = userId || reqUserId + "";
      return onRemoveMemberFromWorkSpace(req, res, next);
    } catch (e: any) {
      return next(
        new AppError(
          "Internal server Error",
          STATUS_CODES.INTERNAL_SERVER_ERROR
        )
      );
    }
  }
);

export const onUpdateUserWorkspaceMember = catchAsync(
  async (req, res, next) => {
    const reqUserId = req.user?.id as number;
    const workspaceId = req.query.workspaceId as string;
    const wsId = parseInt(workspaceId as string);
    // const uId = parseInt(reqUserId as string);
    if (!workspaceId) {
      return next(
        new AppError("Work space ID is required", STATUS_CODES.BAD_REQUEST)
      );
    }
    const isMember = await getMemberByUserIdAndWorkspaceId(reqUserId, wsId);
    if (!isMember.data) {
      return next(
        new AppError(
          isMember.error || "User is not a member of this workspace",
          STATUS_CODES.FORBIDDEN
        )
      );
    }
    req.query.userId = reqUserId + "";

    return onUpdateWorkspaceMember(req, res, next);
  }
);
export const onGetMemberWithWorkspaceByWorkspaceIdIfIsMember = catchAsync(
  async (req, res, next) => {
    const reqUserId = req.user?.id as number;
    const workspaceId = req.query.workspaceId as string;
    if (!workspaceId) {
      return next(
        new AppError("Work space ID is required", STATUS_CODES.BAD_REQUEST)
      );
    }
    const wsId = parseInt(workspaceId as string);
    // const uId = parseInt(reqUserId as string);
    const isMember = await getMemberByUserIdAndWorkspaceId(reqUserId, wsId);
    if (!isMember.data) {
      return next(
        new AppError(
          isMember.error || "User is not a member of this workspace",
          STATUS_CODES.FORBIDDEN
        )
      );
    }

    return response(res, {
      message: "Work Space found",
      data: isMember.data,
    });
  }
);

export const onGetWorkspaceIfMember = catchAsync(async (req, res, next) => {
  const reqUserId = req.user?.id as number;
  const workspaceId = req.query.workspaceId as string;
  if (!workspaceId) {
    return next(
      new AppError("Work space ID is required", STATUS_CODES.BAD_REQUEST)
    );
  }
  const wsId = parseInt(workspaceId as string);
  // const uId = parseInt(reqUserId as string);
  const isMember = await getMemberByUserIdAndWorkspaceId(reqUserId, wsId);
  if (!isMember.data) {
    return next(
      new AppError(
        isMember.error || "User is not a member of this workspace",
        STATUS_CODES.FORBIDDEN
      )
    );
  }

  return response(res, {
    message: "Work Space found",
    data: isMember.data.workSpace,
  });
});
