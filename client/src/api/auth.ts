import request from "@/lib/request";
import {
  SIGN_IN_SCHEMA,
  SIGN_UP_SCHEMA,
  SignInSchemaType,
  SignUpSchemaType,
} from "@/schema/auth";
import { IAppUser } from "@/schema/user";

export const getAuthUser = async (
  Authorization?: string
): Promise<IAppUser | null> => {
  const headers = Authorization
    ? {
        headers: {
          Authorization: `Bearer ${Authorization}`,
        },
      }
    : {};
  const res = await request("users/me", {
    ...headers,
  });

  return res.data;
};

export const signInWithGoogle = async () => {
  const res = await request("google", {
    method: "GET",
  });

  return res.data;
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
    return { data: res.data, success: true };
  } catch (error: any) {
    console.log(error, "error");
    return {
      message: error.message || "Something went wrong",
      success: false,
      error: true,
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
    return { data: res.data, success: true };
  } catch (error: any) {
    console.log(error, "error");
    return {
      message: error.message || "Something went wrong",
      success: false,
      error: true,
    };
  }
};
