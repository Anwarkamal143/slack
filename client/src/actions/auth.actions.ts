"use server";

import { COOKIE_NAME, REFRESH_COOKIE_NAME } from "@/config";

import { createToken, verifyJwt } from "@/lib/jwtToken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const signOut = async (): Promise<boolean | null> => {
  (await cookies()).delete(COOKIE_NAME);
  (await cookies()).delete(REFRESH_COOKIE_NAME);
  return redirect("/login");
};

export const getCookieUser = async (
  requestCookies: any = null
): Promise<null | IServerCookieType> => {
  const rCookies = requestCookies || cookies;
  const token = (await rCookies()).get(COOKIE_NAME)?.value;
  const refreshToken = (await rCookies()).get(REFRESH_COOKIE_NAME)?.value;
  console.log({ token, refreshToken });
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
      } = await createToken(data);
      console.log({ data });
      try {
        (await rCookies()).set(COOKIE_NAME, token, token_attributes);
        (await rCookies()).set(
          REFRESH_COOKIE_NAME,
          refToken,
          refresh_attributes
        );
      } catch (error) {
        console.log(error, "Error on setting");
      }
    }
    const { data } = tokenData;
    return res(data);
  });
};
