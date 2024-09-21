import { AFTER_LOGIN_URL, HOST_NAME } from "@/constants";
import {
  createGoogleUserUseCase,
  getAccountByGoogleIdUseCase,
  getUserById,
} from "@/data-access/users";
import { AccountType, ProviderType } from "@/db/schema";
import { IGoogleUser } from "@/types/ISocial";
import { setCookies } from "@/utils";
import AppError from "@/utils/appError";
import catchAsync from "@/utils/catchAsync";
import { getCodeVerifierandState, googleAuth } from "@/utils/socialauth";
import { Response } from "express";
const googleCookies = {
  google_oauth_state: "google_oauth_state",
  google_code_verifier: "google_code_verifier",
};
const Googlge_Cookies_options = {
  secure: true,
  path: "/",
  httpOnly: true,
  maxAge: 600 * 100,
};
export const googleSignAuth = catchAsync(async (req, res, next) => {
  try {
    const gCS = await getCodeVerifierandState();
    const state = gCS.generateState();
    const codeVerifier = gCS.generateCodeVerifier();
    const gAuth = await googleAuth();
    res.cookie(
      googleCookies.google_oauth_state,
      state,
      Googlge_Cookies_options
    );

    res.cookie(
      googleCookies.google_code_verifier,
      codeVerifier,
      Googlge_Cookies_options
    );
    const generatedURL = await gAuth.createAuthorizationURL(
      state,
      codeVerifier,
      {
        scopes: ["profile", "email"],
      }
    );

    // const url = new URL(generatedURL);

    return res.status(200).json(generatedURL);
  } catch (error) {
    console.log({ error });

    return next(new AppError("Something went wrong", 500));
  }
});

export const googleAuthCallback = catchAsync(async (req, res, next) => {
  const url = new URL(`${HOST_NAME}${req.originalUrl}`);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = req.cookies[googleCookies.google_oauth_state] ?? null;
  const codeVerifier = req.cookies[googleCookies.google_code_verifier] ?? null;

  if (
    !code ||
    !state ||
    !storedState ||
    state !== storedState ||
    !codeVerifier
  ) {
    return next(new AppError("Error on callback11", 400));
  }

  try {
    const gAuth = await googleAuth();
    console.log({ state });
    await gAuth.createAuthorizationURL(state, codeVerifier, {
      scopes: ["profile", "email"],
    });
    const tokens = await gAuth.validateAuthorizationCode(code, codeVerifier);
    const response = await fetch(
      "https://openidconnect.googleapis.com/v1/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      }
    );
    const googleUser = (await response.json()) as IGoogleUser;
    const existingAccount = await getAccountByGoogleIdUseCase(googleUser.sub);
    if (existingAccount) {
      const user = await getUserById(existingAccount.userId);
      setCallbackCookie(res, {
        id: existingAccount.userId,
        provider: AccountType.oauth,
        providerType: ProviderType.google,
        role: user.user?.role,
      });
      return res.status(302).redirect(AFTER_LOGIN_URL);
    }

    const user = await createGoogleUserUseCase(googleUser);

    setCallbackCookie(res, {
      id: user.id,
      provider: AccountType.oauth,
      providerType: ProviderType.google,
      role: user.role,
    });

    return res.status(302).redirect(AFTER_LOGIN_URL);
  } catch (e: any) {
    next(new AppError("Error on callback", 400));
  }
});
const setCallbackCookie = (
  res: Response,
  tokenData: { id: string } & Record<string, any>
) => {
  setCookies(res, tokenData);
  res.cookie(googleCookies.google_code_verifier, "", {
    ...Googlge_Cookies_options,
    maxAge: 0,
  });
  res.cookie(googleCookies.google_oauth_state, "", {
    ...Googlge_Cookies_options,
    maxAge: 0,
  });
};
