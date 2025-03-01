import { ApiModels } from "@/queries/apiModelMapping";
import useCreateItem from "@/queries/useCreateItem";
import { useRefreshStoreActions } from "@/store/useRefreshTokens";
import { SignInSchemaType } from "../schema";

export function useSignIn() {
  const { setRefreshState } = useRefreshStoreActions();
  const {
    mutateAsync,
    isError,
    isPending,
    isSuccess,
    error,
    data: rdata,
  } = useCreateItem<
    typeof ApiModels.Auth,
    { accessToken: string; refreshToken: string }
  >({
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

    // setRefreshState({accessToken: createdWorkspace.data.})
    return res;
  };
  return { handleSignIn, isError, isPending, isSuccess, error };
}
