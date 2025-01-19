import { COOKIE_NAME, REFRESH_COOKIE_NAME } from "@/constants";
import { createAccount } from "@/data-access/accounts";
import { createUser, getUserByEmail, getUserById } from "@/data-access/users";
import { AccountType, ProviderType } from "@/db/schema";
import { RegisterUserSchema } from "@/schemas/User";
import {
  compareArgonHash,
  createArgonHash,
  resetCookies,
  setCookies,
  verifyJwt,
} from "@/utils";
import AppError from "@/utils/appError";
import catchAsync from "@/utils/catchAsync";
import { response } from "@/utils/requestResponse";

export const signUp = catchAsync(async (req, res, next) => {
  const { password: pas, name, email } = req.body;
  const result = RegisterUserSchema.safeParse(req.body);
  if (!result.success) {
    return next(new AppError(result.error?.errors[0].message, 400));
  }
  const existingUser = await getUserByEmail(result.data.email);
  if (existingUser.user) {
    return next(new AppError("Email already in use!", 400));
  }
  try {
    const hashedPassword = await createArgonHash(pas);
    const user = await createUser({ email, password: hashedPassword, name });
    if (!user?.id) {
      return next(new AppError("Registratin Fail", 401));
    }
    await createAccount(user.id);

    setCookies(res, {
      id: user.id,
      providerType: ProviderType.email,
      role: user.role,
      email,
      provider: AccountType.email,
    });
    const { password, ...restUser } = user;
    return response(res, {
      message: "Account created successfully!",
      data: restUser,
      statusCode: 201,
    });
  } catch (error) {
    return next(new AppError("Something went wrong", 500));
  }
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const resUser = await getUserByEmail(email);

    if (!resUser?.user) {
      return next(new AppError("Invalid Credentails", 400));
    }
    const user = resUser.user;
    if (!user?.password) {
      return next(new AppError("Invalid Credentails", 400));
    }
    const isPassewordMatched = await compareArgonHash(user.password, password);
    if (!isPassewordMatched) {
      return next(new AppError("Invalid Credentails", 400));
    }

    setCookies(res, {
      id: user.id,
      providerType: ProviderType.email,
      role: user.role,
      email,
      provider: AccountType.email,
    });
    const { password: psd, ...restUser } = user;
    return response(res, {
      message: "LoggedIn successfully",
      data: restUser,
    });
  } catch (error) {
    return next(new AppError("Something went wrong", 500));
  }
});

export const test = catchAsync(async (_req, res, _next) => {
  res.status(200).json({
    error: false,
    message: "LoggedIn successfully",
    success: true,
    user: {},
  });
});

export const refreshTokens = catchAsync(async (req, res, next) => {
  const refreshToken =
    req.cookies[REFRESH_COOKIE_NAME] || req.headers.refreshToken;
  let token = "";
  // Check Authorization header
  const authHeader = req.headers["authorization"];
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1]; // Extract token from "Bearer <token>"
  }

  // Check cookies if token is not in the Authorization header
  if (!token && req.cookies && req.cookies[COOKIE_NAME]) {
    token = req.cookies[COOKIE_NAME]; // Replace 'accessToken' with your cookie name
  }
  if (!token && !refreshToken) {
    return next(new AppError("You are not loggedin", 401));
  }
  let tokenData = await verifyJwt(token);
  if (!tokenData) {
    tokenData = await verifyJwt(refreshToken);
    if (!tokenData) {
      return next(new AppError("You are not loggedin", 401));
    }
  }
  const { data } = tokenData;
  const user = await getUserById(data.id);

  if (!user.user?.id) {
    resetCookies(res);
    return response(res, {
      statusCode: 200,
      message: "Token not refreshed",
      data: null,
    });
  }

  setCookies(res, data);
  return response(res, {
    statusCode: 200,
    message: "Token refreshed",
    data: null,
  });
});
