import { getUser_Profile_Account_ById, getUserById } from "@/data-access/users";
import { db } from "@/db/db";
import { user } from "@/db/schema";
import { wait } from "@/utils";
import AppError from "@/utils/appError";
import catchAsync from "@/utils/catchAsync";
import { response } from "@/utils/requestResponse";

export const getUsers = catchAsync(async (_req, res, _next) => {
  const users = await db.select().from(user);
  await wait(2000);
  return res.json({ data: users, status: 200, success: true });
});
export const getUserAccountAndProfile = catchAsync(async (req, res, next) => {
  const reqUser = req.user;
  if (!reqUser) {
    return next(new AppError("User does not exist!", 404));
  }
  try {
    const user = await getUser_Profile_Account_ById(reqUser.id);
    if (user.error) {
      return next(new AppError("User does not exist!", 404));
    }

    return response(res, {
      message: "success",
      data: user.user,
    });
  } catch {
    return next(new AppError("User does not exist!", 404));
  }
});

export const getUserByID = catchAsync(async (req, res, next) => {
  try {
    const id = req.params.id;
    const { user } = await getUserById(id);
    if (!user) {
      return next(new AppError("User does not exist!", 404));
    }
    return response(res, {
      message: "success",
      data: user,
    });
  } catch (e) {
    return next(new AppError("User does not exist!", 404));
  }
});
