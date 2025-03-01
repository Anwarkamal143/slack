import request from "@/lib/request";
import { ApiModels } from "@/queries/apiModelMapping";
import useCreateItem from "@/queries/useCreateItem";

import { IAppUser } from "@/schema/user";
import { useRefreshStoreActions } from "@/store/useRefreshTokens";
import { IApiResponse } from "@/types/Iresponse";
import {
  SIGN_IN_SCHEMA,
  SIGN_UP_SCHEMA,
  SignInSchemaType,
  SignUpSchemaType,
} from "../schema";

const AUTH_QUERY_KEYS = {
  register: "register",
  login: "login",
};
const AUTH_QUERY_PATHS = {
  register: "register",
  login: "login",
};

export const getAuthUser = async (
  authToken?: string
): Promise<IApiResponse<IAppUser | null>> => {
  const res = await request("users/me", {
    token: authToken,
  });

  return res.data;
};
export const getRefreshToken = async () => {
  const res = await request("auth/refresh");

  return res.data;
};

export const signInWithGoogle = async () => {
  const res = await request("google", {
    method: "GET",
  });
  return res.data as IApiResponse<any>;
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

  const res = await request("auth/register", {
    method: "POST",
    data: {
      email,
      password,
      name,
    },
  });
  return res.data;
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

  const res = await request("auth/login", {
    method: "POST",
    data: {
      email,
      password,
    },
  });
  return res.data;
};

type ITokens = { accessToken: string; refreshToken: string };
export function useRegisterUser() {
  const { setTokenState } = useRefreshStoreActions();
  const { mutateAsync, isError, isPending, isSuccess, error } = useCreateItem<
    typeof ApiModels.Auth,
    ITokens
  >({
    modelName: ApiModels.Auth,
    queryKey: [AUTH_QUERY_KEYS.register],
    requestOptions: {
      path: AUTH_QUERY_PATHS.register,
    },
  });

  const handleRegister = async (data: SignUpSchemaType) => {
    const res = await mutateAsync({
      data,
    });
    if (res.data) {
      const { accessToken, refreshToken } = res.data;
      setTokenState({
        accessToken: accessToken,
        refreshToken,
        isRefreshing: false,
      });
    }
    return res;
  };

  return { handleRegister, isError, isPending, isSuccess, error };
}

export function useSignIn() {
  const { setTokenState } = useRefreshStoreActions();
  const {
    mutateAsync,
    isError,
    isPending,
    isSuccess,
    error,
    data: rdata,
  } = useCreateItem<typeof ApiModels.Auth, ITokens>({
    modelName: ApiModels.Auth,
    queryKey: ["login"],

    requestOptions: {
      path: "login",
    },
  });

  const handleSignIn = async (data: SignInSchemaType) => {
    const res = await mutateAsync({
      data,
    });
    if (res.data) {
      const { accessToken, refreshToken } = res.data;
      setTokenState({
        accessToken: accessToken,
        refreshToken,
        isRefreshing: false,
      });
    }
    return res;
  };
  return { handleSignIn, isError, isPending, isSuccess, error };
}
