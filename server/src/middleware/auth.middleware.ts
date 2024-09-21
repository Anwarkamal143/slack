import { COOKIE_NAME, REFRESH_COOKIE_NAME } from "@/constants";
import { setCookies, verifyJwt } from "@/utils";
import AppError from "@/utils/appError";
import catchAsync from "@/utils/catchAsync";

// import {decode} from '@auth/core/src/jwt'
const authKey = COOKIE_NAME;

// Authentication
const protect = catchAsync(async (req, res, next) => {
  // 1) Getting the token and check if it's there
  // let token;
  let token = req.cookies[authKey] || req.headers.authorization;
  let refreshToken =
    req.cookies[REFRESH_COOKIE_NAME] || req.headers.refreshToken;
  if (!token && !refreshToken) {
    return next(
      new AppError("You are not logged in! Please log in to get acccess.", 401)
    );
  }
  let tokenData = await verifyJwt(token);
  if (!tokenData) {
    tokenData = await verifyJwt(refreshToken);
    if (!tokenData) {
      return next(
        new AppError(
          "You are not logged in! Please log in to get acccess.",
          401
        )
      );
    }
    const { data } = tokenData;
    setCookies(res, data);
  }
  const { data } = tokenData;

  //   console.log(token);
  // 2) Validate token
  // // 3) Check if the user still exists
  // try {
  // 3) Check if the user still exists
  // const currentUser = await getUser_Profile_Account_ById(data.id)
  // if (!currentUser) {
  //   return next(
  //     new AppError("The user belonging to this token no longer exists.", 401)
  //   );
  // }
  // 4) Check if user changed password after the token was issued
  // if (currentUser.changedPasswordAfter(decoded.iat)) {
  //   return next(new AppError('User recently changed password! Please log in again.', 401));
  // }
  //   Grant Access to Protected Route
  req.user = data;
  // req.user = currentUser;
  // } catch (error: any) {
  //   console.log(error.message, error, "Error message", refreshToken);
  // }

  next();
});
// Authorization
// const restrictTo = (...roles) => {
//   return (req, res, next) => {
//     //  roles ['admin','lead-guide'], roles = 'user'
//     if (!roles.includes(req.user.role)) {
//       return next(new AppError('You do not have permission to perform this action', 403));
//     }
//     next();
//   };
// };

export { protect as isAuthenticated };
