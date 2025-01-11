import {
  COOKIE_NAME,
  getCookiesOptions,
  JWT_EXPIRES_IN,
  JWT_SECRET,
  REFRESH_COOKIE_NAME,
} from "@/constants";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { CookieOptions, Response } from "express";
import jwt from "jsonwebtoken";
import { promisify } from "util";
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
export function jwtSignToken(props: IJwtTokenData) {
  const { id, expiresIn = JWT_EXPIRES_IN, ...rest } = props;
  return jwt.sign({ id, ...rest }, JWT_SECRET, {
    expiresIn: expiresIn,
    // expiresIn: "10s",
  });
}

// export const createToken = (tokenData: { id: string; [key: string]: any }) => {
//   const token = jwtSignToken({ ...tokenData, expiresIn: "2m" });
//   const cookieOptions: CookieOptions = getCookiesOptions();
//   const refreshToken = jwtSignToken({ ...tokenData });
//   return { token, attributes: cookieOptions, refreshToken };
// };

export const createToken = (tokenData: { id: string; [key: string]: any }) => {
  const token = jwtSignToken({ ...tokenData, expiresIn: "1m" });
  const cookieOptions: CookieOptions = getCookiesOptions();
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
  return new Promise((res, rej) => {
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

export const setCookies = (
  res: Response,
  tokenData: { id: string } & Record<string, any>
) => {
  const { token_attributes, token, refreshToken, refresh_attributes } =
    createToken(tokenData);
  res.cookie(COOKIE_NAME, token, token_attributes);
  res.cookie(REFRESH_COOKIE_NAME, refreshToken, refresh_attributes);
};
export const resetCookies = (res: Response) => {
  res.cookie(COOKIE_NAME, "", { ...getCookiesOptions(), maxAge: 0 });
  res.cookie(REFRESH_COOKIE_NAME, "", {
    ...getCookiesOptions(),
    maxAge: 0,
  });
};
