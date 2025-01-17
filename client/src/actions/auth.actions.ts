"use server";

import { COOKIE_NAME, REFRESH_COOKIE_NAME } from "@/config";
import { getUserById } from "@/data/user";

import { verifyAndCreateToken } from "@/lib/jwtToken";
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
  return new Promise(async (res, rej) => {
    const response = await verifyAndCreateToken(token, refreshToken);
    if (response?.data) {
      const {
        token_attributes,
        refresh_attributes,
        refreshToken: refToken,
        token,
      } = response.data;
      const user = getUserById(response.user.id);
      if (!user) {
        return res(null);
      }
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
    if (response?.user) {
      const { user } = response;
      return res(user);
    }
    return res(null);
  });
};
