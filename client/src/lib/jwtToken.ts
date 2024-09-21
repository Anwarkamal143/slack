import { JWT_COOKIE_EXPIRES_IN, JWT_EXPIRES_IN, JWT_SECRET } from "@/config";
import jwt from "jsonwebtoken";
import { promisify } from "util";

type IJwtTokenData = {
  id: string;
  expiresIn?: string;
  [key: string]: any;
};
export function jwtSignToken(props: IJwtTokenData) {
  const { id, expiresIn = JWT_EXPIRES_IN, ...rest } = props;
  console.log({ expiresIn });
  return jwt.sign({ id, ...rest }, JWT_SECRET, {
    expiresIn: expiresIn,
    // expiresIn: "10s",
  });
}
type IPayload = {
  id: string;
  provider: string;
  providerType: string;
  [key: string]: any;
};
export async function verifyJwt(token: string | null | undefined) {
  if (!token) {
    return null;
  }
  try {
    const token_data = await promisify(jwt.verify as any)(token, JWT_SECRET);
    const { iat, exp, ...rest } = token_data;
    return { token_data, data: rest };
  } catch (error: any) {
    // const message = error.message;
    // if (message && message.toLowerCase().indexOf("jwt expired") != -1) {
    //   return JWT_MESSAGES.jwt_expired;
    // }
    return null;
  }
}
export const getCookiesOptions = (cookies: Record<string, any> = {}) => {
  const updatedCookies = { ...cookies };
  updatedCookies.expires =
    updatedCookies.expires ||
    new Date(Date.now() + JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000);
  updatedCookies.httpOnly = updatedCookies.httpOnly || true;
  updatedCookies.sameSite = updatedCookies.sameSite || "lax";
  updatedCookies.path = updatedCookies.path || "/";

  if (process.env.NODE_ENV === "production") {
    updatedCookies.secure = true;
  }

  return updatedCookies;
};
export const createToken = (tokenData: { id: string; [key: string]: any }) => {
  const token = jwtSignToken({ ...tokenData, expiresIn: "2m" });
  const cookieOptions: ICookieOptions = getCookiesOptions();
  const refreshToken = jwtSignToken({ ...tokenData });
  return {
    token,
    refresh_attributes: cookieOptions,
    refreshToken,
    token_attributes: {
      ...cookieOptions,
      expires: new Date(Date.now() + 60 * 3000),
    },
  };
};
