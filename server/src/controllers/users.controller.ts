import { getUser_Profile_Account_ById } from "@/data-access/users";
import { db } from "@/db/db";
import { user } from "@/db/schema";
import { wait } from "@/utils";
import catchAsync from "@/utils/catchAsync";

export const getUsers = catchAsync(async (req, res, next) => {
  const users = await db.select().from(user);
  await wait(2000);
  return res.json({ data: users, status: 200, success: true });
});
export const getUserAccountAndProfile = catchAsync(async (req, res, next) => {
  const reqUser = req.user;
  try {
    const user = await getUser_Profile_Account_ById(reqUser.id);
    if (user.error) {
      return res.status(200).json(null);
    }
    return res.status(200).json(user.user);
  } catch {
    return res.status(200).json(null);
  }
});
