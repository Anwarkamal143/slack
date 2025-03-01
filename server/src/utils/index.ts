import { IServerCookieType } from "@/@types/cookie";
import {
  COOKIE_NAME,
  getCookiesOptions,
  JWT_COOKIE_EXPIRES_IN,
  JWT_EXPIRES_IN,
  JWT_SECRET,
  REDIS_PREFIX,
  REFRESH_COOKIE_NAME,
} from "@/constants";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { CookieOptions, Response } from "express";
import * as jose from "jose";
import { osloPassword } from "./lucia";

// export const createHash = (password: string, salt: number = 10): string => {
//   return crypto
//     .createHmac("sha256", [salt, password].join("/"))
//     .update(JWT_SECRET)
//     .digest("hex");
// };
export const createHash = async (text: string) => {
  return await bcrypt.hash(text, 10);
};
export async function compareHash(
  candidatePassword: string,
  userPassword: string
) {
  const isPasswordMatch = await bcrypt.compare(candidatePassword, userPassword);
  return !!isPasswordMatch;
}

// export const createHashToken = (text: string): string => {
//   return crypto.createHash("sha256").update(text).digest("hex");
// };

export const random = () => crypto.randomBytes(128).toString("base64");

// Generate a UUID using timestamp and random numbers
export function generateUUID() {
  var dt = new Date().getTime();
  var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    function (c) {
      var r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
    }
  );
  return uuid;
}
type IJwtTokenData = {
  id: number;
  expiresIn?: string;
  [key: string]: any;
};

export async function jwtSignToken(props: IJwtTokenData) {
  const { expiresIn = JWT_EXPIRES_IN, ...rest } = props;
  const secret = new TextEncoder().encode(JWT_SECRET);
  return await new jose.SignJWT({ ...rest })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secret);
}

export const createToken = async (tokenData: {
  id: number;
  [key: string]: any;
}) => {
  const token = await jwtSignToken({ ...tokenData, expiresIn: "1d" });
  const token_attributes: CookieOptions = getCookiesOptions({ expiresIn: 1 });
  const refresh_attributes: CookieOptions = getCookiesOptions({
    expiresIn: JWT_COOKIE_EXPIRES_IN,
  });
  const refreshToken = await jwtSignToken({
    ...tokenData,
    expiresIn: JWT_EXPIRES_IN,
  });
  return {
    accessToken: token,
    refresh_attributes,
    refreshToken,
    token_attributes,
  };
};
export function changedPasswordAfter(
  passwordChangedAt: Date | number,
  JWTTimestamp: number
) {
  if (passwordChangedAt) {
    const changedTimestamp =
      typeof passwordChangedAt === "number"
        ? passwordChangedAt / 1000
        : parseInt(`${passwordChangedAt.getTime() / 1000}`, 10);
    return JWTTimestamp < changedTimestamp;
  }
  // False means not changed
  return false;
}
export function createPasswordResetToken() {
  const resetToken = crypto.randomBytes(32).toString("hex");
  const passwordResetToken = createHash(resetToken);
  const passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return { passwordResetToken, passwordResetExpires };
}

export const wait = async (time: number = 0) => {
  return new Promise((res, _rej) => {
    setTimeout(() => {
      res(true);
    }, time);
  });
};

export const createArgonHash = async (text: string) => {
  const { Argon2id } = await osloPassword();
  const hashedpassword = await new Argon2id().hash(text);

  return hashedpassword;
};

export const compareArgonHash = async (
  hashedText: string,
  plainText: string
) => {
  const { Argon2id } = await osloPassword();
  const isPassewordMatched = await new Argon2id().verify(hashedText, plainText);

  return isPassewordMatched;
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
export const setCookies = async (
  res: Response,
  tokenData: { id: number } & Record<string, any>
) => {
  const { token_attributes, accessToken, refreshToken, refresh_attributes } =
    await createToken(tokenData);

  res.cookie(COOKIE_NAME, accessToken, token_attributes);
  res.cookie(REFRESH_COOKIE_NAME, refreshToken, refresh_attributes);
  return { accessToken, refreshToken };
};
export const resetCookies = (res: Response) => {
  const expires = new Date(Date.now() - 2 * 60 * 1000);
  res.cookie(COOKIE_NAME, "", {
    ...getCookiesOptions({
      cookies: { expires },
    }),
    maxAge: 0,
  });
  res.cookie(REFRESH_COOKIE_NAME, "", {
    ...getCookiesOptions({
      cookies: { expires },
    }),
    maxAge: 0,
  });
};

type Check<T> = [T] extends [number] ? number : null;
export function safeParseInt<T extends number | null = number>(
  str: string | number | undefined,
  // @ts-ignore
  defaultValue: T = null
) {
  if (str === null || str === undefined) return defaultValue as Check<T>;
  if (typeof str !== "string" && typeof str !== "number")
    return defaultValue as Check<T>;

  try {
    const trimmed = String(str).trim(); // Convert to string & trim spaces
    if (!/^-?\d+$/.test(trimmed)) return defaultValue as Check<T>; // Ensure it's a valid integer string
    return parseInt(trimmed) as number;
  } catch {
    return defaultValue as Check<T>;
  }
}

export const createRedisKey = (key: string) => {
  return `${REDIS_PREFIX}_${key}`;
};
