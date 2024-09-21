import useUserStore from "@/store/userStore";
import { redirect } from "next/navigation";
import { useLayoutEffect } from "react";

const useIsAuth = (redirectTodashboardIfAuth = false) => {
  const user = useUserStore((state) => state.user);
  useLayoutEffect(() => {
    if (redirectTodashboardIfAuth && user?.id) {
      return redirect("/");
    }
    if (!redirectTodashboardIfAuth && !user?.id) {
      return redirect("/login");
    }
  }, [user?.id]);
  return null;
};

export default useIsAuth;
