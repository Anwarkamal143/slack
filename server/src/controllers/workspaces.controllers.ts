import { SOCKETS_KEYS } from "@/constants";
import {
  createWorkSpace,
  deleteUserWorkSpaceById,
  deleteWorkSpaceById,
  getUserWorkSpaceById,
  getWorkSpaceById,
  getWorkspaces,
  updateUserWorkSpaceById,
  updateWorkSpaceById,
} from "@/data-access/workspaces";
import { getMemberByUserIdAndWorkspaceId } from "@/data-access/workSpacesMembers";
import { WorkSpaceMemberRole } from "@/db";
import { IWorkspaceUpdate } from "@/schemas/Workspace.schema";
import RedisSocket from "@/sockets";
import { generateUUID } from "@/utils";
import AppError from "@/utils/appError";
import catchAsync from "@/utils/catchAsync";
import { STATUS_CODES } from "@/utils/ErrorsUtil";
import { response } from "@/utils/requestResponse";

export const onGetAllWorkSpaces = catchAsync(async (req, res, next) => {
  const { limit = 0, page } = req.query;
  const paginationPage = parseInt((page as string) || "1", 10);
  const paginationLimit = parseInt((limit as string) || "50", 10);
  try {
    const workspaces = await getWorkspaces(null, {
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
export const onGetWorkSpaceById = catchAsync(async (req, res, next) => {
  const workSpaceId = req.params.workspaceId;
  const wsId = parseInt(workSpaceId as string);
  // const uId = parseInt(reqUserId as string);
  const workspace = await getWorkSpaceById(wsId);
  if (workspace.error) {
    return next(new AppError(workspace.error, 404));
  }
  return response(res, {
    message: "Work Space found",
    data: workspace.data,
  });
});

export const onDeleteWorkspaceById = catchAsync(async (req, res, next) => {
  const workSpaceId = req.params.workspaceId;
  const wsId = parseInt(workSpaceId as string);
  // const uId = parseInt(reqUserId as string);
  const workspace = await deleteWorkSpaceById(wsId);
  if (workspace.error) {
    return next(new AppError(workspace.error, STATUS_CODES.NOT_FOUND));
  }
  return response(res, {
    message: "Work Space found",
    data: workspace.data,
  });
});

export const onCcreateUserWorkspace = catchAsync(async (req, res, next) => {
  const workSpaceData = req.body;
  const user = req.user;

  workSpaceData.userId = user?.id;
  workSpaceData.joinCode = generateUUID();

  const workspace = await createWorkSpace(workSpaceData);
  if (workspace.error) {
    return next(new AppError(workspace.error, STATUS_CODES.NOT_FOUND));
  }

  return response(res, {
    message: "Work space created successfully.",
    data: workspace.data,
  });
});

export const onUpdateWorkspaceById = catchAsync(async (req, res, next) => {
  const workSpaceId = req.params.workspaceId;
  const workSpaceData = req.body;
  const user = req.user;

  if (!workSpaceId) {
    return next(
      new AppError("Work space id is required", STATUS_CODES.FORBIDDEN)
    );
  }
  const wsId = parseInt(workSpaceId as string);
  // const uId = parseInt(reqUserId as string);
  const isMember = await getMemberByUserIdAndWorkspaceId(
    user!.id as number,
    wsId
  );
  if (!isMember.data || isMember.data.role !== WorkSpaceMemberRole.admin) {
    return next(
      new AppError(isMember.error || "Unauthorized", STATUS_CODES.FORBIDDEN)
    );
  }
  // const findWorkspace = await getUserWorkSpaceById(user.id, workSpaceId);
  // if (!findWorkspace.data) {
  //   return next(new AppError("Work space not found", 404));
  // }
  const workspace = await updateWorkSpaceById(workSpaceData, wsId);
  if (workspace.error) {
    return next(new AppError(workspace.error, 404));
  }
  return response(res, {
    message: "Work Space updated",
    data: workspace.data,
  });
});

export const onGetCurrentUserWorkSpaceById = catchAsync(
  async (req, res, next) => {
    const workSpaceId = req.params.workspaceId;
    const user = req.user;
    const wsId = parseInt(workSpaceId as string);
    // const uId = parseInt(reqUserId as string);
    const workspace = await getUserWorkSpaceById(user?.id, wsId);
    if (!workspace.data) {
      return next(new AppError(workspace.error, 404));
    }

    return response(res, {
      message: "Work Space",
      data: workspace.data,
    });
  }
);
export const onGetCurrentUserWorkSpaces = catchAsync(async (req, res, next) => {
  const user = req.user;

  const { limit = 0, page } = req.query;
  const paginationPage = parseInt((page as string) || "1", 10);
  const paginationLimit = parseInt((limit as string) || "50", 10);
  const workSpaceUserId = user?.id;
  const workspaces = await getWorkspaces(workSpaceUserId, {
    page: paginationPage,
    pageSize: paginationLimit,
  });
  if (workspaces.error) {
    return next(new AppError(workspaces.error, STATUS_CODES.BAD_REQUEST));
  }
  return response(res, {
    message: "get Work Spaces",
    ...workspaces.data,
  });
});

export const onDeleteCurrentUserWorkSpaceById = catchAsync(
  async (req, res, next) => {
    const workSpaceId = req.params.workspaceId;
    const user = req.user;
    const socket = req.skt;
    const { io } = RedisSocket.getInstances();
    // const socket = await getSocket(user?.id);
    console.log(
      io.of("/").sockets.size,
      `socketId: ${socket?.id} with userId: ${socket?.user?.id}`,
      "connected client"
    );
    const wsId = parseInt(workSpaceId as string);
    // const uId = parseInt(reqUserId as string);
    const workspace = await deleteUserWorkSpaceById(user!.id, wsId);
    if (!workspace.data) {
      return next(new AppError(workspace.error, STATUS_CODES.BAD_REQUEST));
    }
    socket?.broadcast?.emit(SOCKETS_KEYS.WORKSPACE_DELETED, workspace.data);
    return response(res, {
      message: "Work Space Deleted",
      data: workspace.data,
    });
  }
);
export const onUpdateCurrentUserWorkspaceById = catchAsync(
  async (req, res, next) => {
    const workSpaceId = req.params.workspaceId;
    const workSpaceData = req.body as IWorkspaceUpdate;
    const user = req.user;
    const { getSocket } = RedisSocket.getInstances();
    if (!workSpaceId) {
      return next(
        new AppError("Work space id is required", STATUS_CODES.BAD_REQUEST)
      );
    }
    const wsId = parseInt(workSpaceId as string);
    // const uId = parseInt(reqUserId as string);
    const socket = await getSocket(req.user?.id + "");
    const findWorkspace = await getUserWorkSpaceById(user!.id, wsId);
    if (!findWorkspace.data) {
      return next(new AppError("Work space not found", STATUS_CODES.NOT_FOUND));
    }
    const workspace = await updateUserWorkSpaceById(
      workSpaceData,
      user!.id,
      wsId
    );
    if (workspace.error) {
      return next(new AppError(workspace.error, STATUS_CODES.BAD_REQUEST));
    }
    socket?.broadcast?.emit(SOCKETS_KEYS.WORKSPACE_UPDATED, workspace.data);

    return response(res, {
      message: "Work Space updated",
      data: workspace.data,
    });
  }
);
