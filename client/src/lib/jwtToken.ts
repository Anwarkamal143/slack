import { JWT_COOKIE_EXPIRES_IN, JWT_EXPIRES_IN, JWT_SECRET } from "@/config";
import * as jose from "jose";

type IJwtTokenData = {
  id: string;
  expiresIn?: string;
  [key: string]: any;
};
const getCookieTime = (expiresIn: number = 1) => {
  const expireIn = expiresIn * 24 * 60 + 1;
  return new Date(Date.now() + expireIn * 60 * 1000);
};
export const getCookiesOptions = (props?: {
  cookies?: Record<string, any>;
  expiresIn?: number;
}) => {
  const { cookies, expiresIn = JWT_COOKIE_EXPIRES_IN } = props || {
    expiresIn: JWT_COOKIE_EXPIRES_IN,
    cookies: {},
  };
  const updatedCookies = { ...cookies };
  updatedCookies.expires = updatedCookies.expires || getCookieTime(expiresIn);
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
    if (payload.exp) {
      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
      const isExpired = payload.exp < currentTime;
      if (isExpired) {
        // throw new Error("Token has expired");
        return null;
      }
    }
    return { token_data: payload, data: rest as IServerCookieType };
  } catch (error: any) {
    console.log({ error });
    if (error instanceof jose.errors.JWTExpired) {
      return null;
    }
    throw error;
  }
}
export async function jwtSignToken(props: IJwtTokenData) {
  const { expiresIn = JWT_EXPIRES_IN, ...rest } = props;
  const secret = new TextEncoder().encode(JWT_SECRET);
  try {
    return await new jose.SignJWT({ ...rest })
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setIssuedAt()
      .setExpirationTime(expiresIn)
      .sign(secret);
  } catch (error) {
    return null;
  }
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
  const token = await jwtSignToken({ ...tokenData, expiresIn: "1d" });
  const token_attributes: ICookieOptions = getCookiesOptions({ expiresIn: 1 }); // 1 day 1 minutes;
  const refresh_attributes: ICookieOptions = getCookiesOptions({
    expiresIn: JWT_COOKIE_EXPIRES_IN,
  }); // 7 days 1 minutes;
  const refreshToken = await jwtSignToken({
    ...tokenData,
    expiresIn: JWT_EXPIRES_IN,
  }); // 7d
  return {
    accessToken: token,
    refresh_attributes,
    refreshToken,
    token_attributes,
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
        accessToken,
      } = await createToken(data);
      response = {
        user: data,
        data: {
          token_attributes,
          refresh_attributes,
          refreshToken: refToken,
          accessToken,
        },
      };
    } else {
      response = {
        data: null,
        user: tokenData?.data as any,
      };
      0;
    }
    return response;
  } catch (e) {}
  return response;
};
