import { getAuthUser } from "@/api/auth";
import useUserStore from "@/store/userStore";
import { useEffect, useState } from "react";
import useRefreshToken from "./useRefreshToken";

const useFetchUser = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isServer, setIsServer] = useState(true);
  useRefreshToken();
  const setUser = useUserStore((state) => state.setUser);

  const onGetUser = async () => {
    try {
      setIsServer(false);
      setIsLoading(true);
      const data = await getAuthUser();
      if (data.data?.id) {
        const { accounts, ...rest } = data.data;
        setUser({
          user: rest,
          accounts,
          isAuthenticated: true,
          isLoggedIn: true,
        });
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    onGetUser();
    return () => {};
  }, []);
  return { isLoading, isServer };
};

export default useFetchUser;
