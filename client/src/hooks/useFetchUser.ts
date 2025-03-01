import { getAuthUser } from "@/features/auth/api";
import { ApiModels } from "@/queries/apiModelMapping";
import useGetItem from "@/queries/useGetItem";
import { IAppUser } from "@/schema/user";
import { useUserStoreActions } from "@/store/userUserStore";
import { useEffect, useState } from "react";
import useRefreshToken from "./useRefreshToken";

const useFetchUser = () => {
  const [isServer, setIsServer] = useState(true);
  useRefreshToken();
  const { setUser } = useUserStoreActions();

  const onGetUser = async () => {
    try {
      setIsServer(false);

      const responeData = await getAuthUser();
      if (responeData.data?.id) {
        const { accounts, ...rest } = responeData.data;
        setUser({
          user: rest,
          accounts,
          isAuthenticated: true,
          isLoggedIn: true,
        });
      }
      const { data } = responeData;
      return (await Promise.resolve(data)) as IAppUser;
    } catch (error) {
    } finally {
    }
    return await Promise.resolve(null);
  };
  const { isLoading } = useGetItem({
    modelName: ApiModels.Auth,
    queryKey: ["appUser"],
    queryOptions: {
      queryFn: onGetUser as any,
      enabled: !isServer,
    },
  });
  useEffect(() => {
    setIsServer(false);

    return () => {};
  }, []);

  return { isLoading, isServer };
};

export default useFetchUser;
