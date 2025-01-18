import { getRefreshToken } from "@/api/auth";
import useRefreshStore from "@/store/useRefreshTokens";
import useUserStore from "@/store/userStore";
import router from "next/router";
import { useEffect } from "react";

function useRefreshToken() {
  const userId = useUserStore((state) => state.user)?.id;
  const setIsRefreshing = useRefreshStore((state) => state.setIsRefreshing);
  const fetchData = async () => {
    try {
      setIsRefreshing(true);
      await getRefreshToken();
    } catch (error) {
      router.replace("/login");
      console.error(error);
    } finally {
      setIsRefreshing(false);
    }
  };
  useEffect(() => {
    let intervalId: any = null;
    if (userId) {
      intervalId = setInterval(fetchData, 540000);
    }
    // Clear the interval on unmount
    return () => clearInterval(intervalId);
  }, [userId]);
  return null;
}

export default useRefreshToken;
