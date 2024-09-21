"use server";

import { COOKIE_NAME, REFRESH_COOKIE_NAME } from "@/config";

import { createToken, verifyJwt } from "@/lib/jwtToken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const signOut = async (): Promise<boolean | null> => {
  cookies().delete(COOKIE_NAME);
  cookies().delete(REFRESH_COOKIE_NAME);
  return redirect("/login");
};

export const getUserOrRedirect = async () => {
  const user = {};
  if (!user) {
    return redirect("/login");
  }

  return user;
};

export const getServerUser = async (): Promise<null | IServerCookieType> => {
  const token = cookies().get(COOKIE_NAME)?.value;
  const refreshToken = cookies().get(REFRESH_COOKIE_NAME)?.value;
  return new Promise(async (res, rej) => {
    if (!token && !refreshToken) {
      return res(null);
    }
    let tokenData = await verifyJwt(token);
    if (!tokenData) {
      tokenData = await verifyJwt(refreshToken);
      if (!tokenData) {
        return res(null);
      }
      const { data } = tokenData;
      const {
        token_attributes,
        refresh_attributes,
        refreshToken: refToken,
        token,
      } = createToken(data);
      cookies().set(COOKIE_NAME, token, token_attributes);
      cookies().set(REFRESH_COOKIE_NAME, refToken, refresh_attributes);
    }
    const { data } = tokenData;
    return res(data);
  });
};
