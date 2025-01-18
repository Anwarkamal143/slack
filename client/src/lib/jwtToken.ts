import { JWT_COOKIE_EXPIRES_IN, JWT_EXPIRES_IN, JWT_SECRET } from "@/config";
import * as jose from "jose";

type IJwtTokenData = {
  id: string;
  expiresIn?: string;
  [key: string]: any;
};
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
export async function verifyJwt(token: string | null | undefined) {
  if (!token) {
    return null;
  }
  try {
    const secret = new TextEncoder().encode(JWT_SECRET); // Get secret as Uint8Array

    const token_data = await jose.jwtVerify(token, secret);
    const { payload } = token_data;
    const { iat, exp, ...rest } = payload;
    return { token_data: payload, data: rest as IServerCookieType };
  } catch (error: any) {
    console.log({ error });
    // const message = error.message;
    // if (message && message.toLowerCase().indexOf("jwt expired") != -1) {
    //   return JWT_MESSAGES.jwt_expired;
    // }
    return null;
  }
}
export async function jwtSignToken(props: IJwtTokenData) {
  const { expiresIn = JWT_EXPIRES_IN, ...rest } = props;
  const secret = new TextEncoder().encode(JWT_SECRET);
  return await new jose.SignJWT({ ...rest })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secret);
}
type IPayload = {
  id: string;
  provider: string;
  providerType: string;
  [key: string]: any;
};
export const createToken = async (tokenData: {
  id: string;
  [key: string]: any;
}) => {
  const token = await jwtSignToken({ ...tokenData, expiresIn: "30m" });
  const cookieOptions: ICookieOptions = getCookiesOptions();
  const refreshToken = await jwtSignToken({ ...tokenData, expiresIn: "90d" });
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

export const verifyAndCreateToken = async (
  token?: string,
  refreshToken?: string
) => {
  let response: null | {
    user: IServerCookieType;
    data: Record<string, any> | null;
  } = null;
  try {
    if (!token && !refreshToken) {
      return response;
    }
    let tokenData = await verifyJwt(token);
    if (!tokenData) {
      tokenData = await verifyJwt(refreshToken);
      if (!tokenData) {
        return response;
      }
      const { data } = tokenData;
      const {
        token_attributes,
        refresh_attributes,
        refreshToken: refToken,
        token,
      } = await createToken(data as any);
      response = {
        user: data as any,
        data: {
          token_attributes,
          refresh_attributes,
          refreshToken: refToken,
          token,
          isRefreshed: true,
        },
      };
    } else {
      response = {
        data: null,
        user: tokenData?.data as any,
      };
    }
    return response;
  } catch (e) {}
  return response;
};
