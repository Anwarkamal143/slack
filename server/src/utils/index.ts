import {
  COOKIE_NAME,
  getCookiesOptions,
  JWT_COOKIE_EXPIRES_IN,
  JWT_EXPIRES_IN,
  JWT_SECRET,
  REFRESH_COOKIE_NAME,
} from "@/constants";
import { IServerCookieType } from "@/types/cookie";
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
  id: string;
  expiresIn?: string;
  [key: string]: any;
};
// export function jwtSignToken(props: IJwtTokenData) {
//   const { id, expiresIn = JWT_EXPIRES_IN, ...rest } = props;
//   return jwt.sign({ id, ...rest }, JWT_SECRET, {
//     expiresIn: expiresIn,
//     // expiresIn: "10s",
//   });
// }
export async function jwtSignToken(props: IJwtTokenData) {
  const { expiresIn = JWT_EXPIRES_IN, ...rest } = props;
  const secret = new TextEncoder().encode(JWT_SECRET);
  return await new jose.SignJWT({ ...rest })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secret);
}
// export const createToken = (tokenData: { id: string; [key: string]: any }) => {
//   const token = jwtSignToken({ ...tokenData, expiresIn: "2m" });
//   const cookieOptions: CookieOptions = getCookiesOptions();
//   const refreshToken = jwtSignToken({ ...tokenData });
//   return { token, attributes: cookieOptions, refreshToken };
// };

export const createToken = async (tokenData: {
  id: string;
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
    token,
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
export const setCookies = async (
  res: Response,
  tokenData: { id: string } & Record<string, any>
) => {
  const { token_attributes, token, refreshToken, refresh_attributes } =
    await createToken(tokenData);

  res.cookie(COOKIE_NAME, token, token_attributes);
  res.cookie(REFRESH_COOKIE_NAME, refreshToken, refresh_attributes);
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
