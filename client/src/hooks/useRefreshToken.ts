"use client";
import { getRefreshToken } from "@/features/auth/api";
import { ApiModels } from "@/queries/apiModelMapping";
import useGetItem from "@/queries/useGetItem";
import { useRefreshStoreActions } from "@/store/useRefreshTokens";
import { useUserStoreStoreUser } from "@/store/userUserStore";
import router from "next/router";

function useRefreshToken() {
  const userId = useUserStoreStoreUser()?.id;
  const { setTokenState, setIsRefreshing } = useRefreshStoreActions();
  const fetchData = async () => {
    try {
      setIsRefreshing(true);
      const refresTokensRespones = await getRefreshToken();
      if (refresTokensRespones?.data?.accessToken) {
        setTokenState({
          isRefreshing: false,
          accessToken: refresTokensRespones.data.accessToken,
          refreshToken: refresTokensRespones.data.refreshToken,
        });
        return refresTokensRespones.data;
      }
      return null;
    } catch (error) {
      router.replace("/login");
      console.error(error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useGetItem({
    modelName: ApiModels.Auth,
    queryKey: ["refreshTokens"],
    queryOptions: {
      enabled: !!userId,
      // refetchInterval: 5400,
      refetchInterval: 540000,
      queryFn: fetchData,
      networkMode: "online",
    },
  });
  return null;
}

export default useRefreshToken;
