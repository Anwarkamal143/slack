import request from "@/lib/request";
import {
  SIGN_IN_SCHEMA,
  SIGN_UP_SCHEMA,
  SignInSchemaType,
  SignUpSchemaType,
} from "@/schema/auth";
import { IAppUser } from "@/schema/user";
import { IResponseType } from "@/types/response";

export const getAuthUser = async (
  authToken?: string
): Promise<IResponseType<IAppUser | null>> => {
  const res = await request("users/me", {
    token: authToken,
  });

  return res.data;
};
export const getRefreshToken = async (): Promise<
  IResponseType<IAppUser | null>
> => {
  const res = await request("auth/refresh");

  return res.data;
};

export const signInWithGoogle = async () => {
  try {
    const res = await request("google", {
      method: "GET",
    });
    return res.data as IResponseType<any>;
  } catch (error: any) {
    return {
      message: error.message || "Something went wrong",
      success: false,
      error: true,
      data: null,
    };
  }
};

export const signUp = async (values: SignUpSchemaType) => {
  const parseResult = SIGN_UP_SCHEMA.safeParse(values);

  if (!parseResult.success) {
    return {
      message: parseResult.error.errors[0].message,
      error: true,
      success: false,
    };
  }
  const { email, password, name } = parseResult.data;
  try {
    const res = await request("auth/register", {
      method: "POST",
      data: {
        email,
        password,
        name,
      },
    });
    return res.data;
  } catch (error: any) {
    return {
      message: error.message || "Something went wrong",
      success: false,
    };
  }
};
export const signIn = async (values: SignInSchemaType) => {
  const parseResult = SIGN_IN_SCHEMA.safeParse(values);

  if (!parseResult.success) {
    return {
      message: parseResult.error.errors[0].message,
      error: true,
      success: false,
    };
  }
  const { email, password } = parseResult.data;

  try {
    const res = await request("auth/login", {
      method: "POST",
      data: {
        email,
        password,
      },
    });
    return res.data;
  } catch (error: any) {
    return {
      message: error.message || "Something went wrong",
      success: false,
      error: true,
    };
  }
};
