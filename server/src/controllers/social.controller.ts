import { AFTER_LOGIN_URL, HOST_NAME } from "@/constants";
import {
  createGoogleUserUseCase,
  getAccountByGoogleIdUseCase,
  getUserById,
} from "@/data-access/users";
import { AccountType, ProviderType } from "@/db";
import { setCookies } from "@/utils";
import AppError from "@/utils/appError";
import catchAsync from "@/utils/catchAsync";
import { response } from "@/utils/requestResponse";
import { getArcticeMethods, googleAuth } from "@/utils/socialauth";

import { CookieOptions, Response } from "express";
const googleCookies = {
  google_oauth_state: "google_oauth_state",
  google_code_verifier: "google_code_verifier",
};
const Googlge_Cookies_options: CookieOptions = {
  // secure: true,
  path: "/",
  httpOnly: true,
  maxAge: 600 * 1000,
  secure: process.env.NODE_ENV === "production",
};
export const googleSignAuth = catchAsync(async (_req, res, next) => {
  try {
    const gCS = await getArcticeMethods();
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
    const generatedURL = gAuth.createAuthorizationURL(state, codeVerifier, [
      "profile",
      "email",
    ]);

    // const url = new URL(generatedURL);
    return response(res, {
      success: true,
      message: "Redirect URL generated",
      data: generatedURL,
    });
  } catch (error) {
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
    return next(new AppError("Error on callback", 400));
  }

  try {
    const gAuth = await googleAuth();
    gAuth.createAuthorizationURL(state, codeVerifier, ["profile", "email"]);
    const gCS = await getArcticeMethods();
    const tokens: typeof gCS.OAuth2Tokens =
      await gAuth.validateAuthorizationCode(code, codeVerifier);
    const { decodeIdToken } = await getArcticeMethods();
    // const accessToken: any = tokens.accessToken();

    // const response = await fetch(
    //   "https://openidconnect.googleapis.com/v1/userinfo",
    //   {
    //     headers: {
    //       Authorization: `Bearer ${accessToken}`,
    //     },
    //   }
    // );
    // const googleUser = (await response.json()) as IGoogleUser;
    const googleUser = decodeIdToken(tokens.idToken());
    const { data: existingAccount } = await getAccountByGoogleIdUseCase(
      googleUser.sub
    );
    if (existingAccount) {
      const { data: user } = await getUserById(existingAccount.userId);
      await setCallbackCookie(res, {
        id: existingAccount.userId,
        provider: AccountType.oauth,
        providerType: ProviderType.google,
        role: user?.role,
      });
      return res.status(302).redirect(AFTER_LOGIN_URL);
    }

    const { data: user } = await createGoogleUserUseCase(googleUser);
    if (user) {
      await setCallbackCookie(res, {
        id: user.id,
        provider: AccountType.oauth,
        providerType: ProviderType.google,
        role: user.role,
      });
    }

    return res.status(302).redirect(AFTER_LOGIN_URL);
  } catch (e: any) {
    next(new AppError("Error on callback: " + e, 400));
  }
});
const setCallbackCookie = async (
  res: Response,
  tokenData: { id: number } & Record<string, any>
) => {
  await setCookies(res, tokenData);
  res.cookie(googleCookies.google_code_verifier, "", {
    ...Googlge_Cookies_options,
    maxAge: 0,
    expires: new Date(Date.now() - 2 * 60 * 1000),
  });
  res.cookie(googleCookies.google_oauth_state, "", {
    ...Googlge_Cookies_options,
    maxAge: 0,
    expires: new Date(Date.now() - 2 * 60 * 1000),
  });
};
