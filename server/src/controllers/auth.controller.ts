import { createAccount } from "@/data-access/accounts";
import { createProfile } from "@/data-access/profiles";
import { createUser, getUserByEmail } from "@/data-access/users";
import { AccountType, ProviderType } from "@/db/schema";
import { RegisterUserSchema } from "@/schemas/User";
import { compareArgonHash, createArgonHash, setCookies } from "@/utils";
import AppError from "@/utils/appError";
import catchAsync from "@/utils/catchAsync";
import { generateRandomName } from "@/utils/lucia";

export const signUp = catchAsync(async (req, res, next) => {
  const { password: pas, name, email, ...rest } = req.body;
  const result = RegisterUserSchema.safeParse(req.body);
  if (!result.success) {
    return next(new AppError(result.error?.errors[0].message, 400));
  }
  const existingUser = await getUserByEmail(result.data.email);
  if (existingUser) {
    return next(new AppError("Email already in use!", 400));
  }
  try {
    const hashedPassword = await createArgonHash(pas);
    const user = await createUser({ email, password: hashedPassword });
    await createAccount(user.id);
    const profile = await createProfile(user.id, generateRandomName(name));
    if (!user?.id) {
      return next(new AppError("Registratin Fail", 401));
    }

    setCookies(res, {
      id: user.id,
      providerType: ProviderType.email,
      role: user.role,
      email,
      provider: AccountType.email,
    });

    res.status(201).json({
      status: "success",

      data: {
        user: user,
        profile: profile,
        message: "Account created successfully!",
      },
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

    res.status(200).json({
      error: false,
      message: "LoggedIn successfully",
      success: true,
      user: user,
    });
  } catch (error) {
    return next(new AppError("Something went wrong", 500));
  }
});

export const test = catchAsync(async (req, res, next) => {
  res.status(200).json({
    error: false,
    message: "LoggedIn successfully",
    success: true,
    user: {},
  });
});
