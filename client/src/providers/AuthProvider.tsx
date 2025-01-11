"use client";
import { getAuthUser } from "@/api/auth";
import useUserStore from "@/store/userStore";
import { ReactNode, Suspense, useEffect, useState } from "react";
import PageLoader from "../components/loader";
import SocketContextProvider from "./SocketProvider";
type Props = {
  children: ReactNode;
};

export default function AuthProvider(props: Props) {
  const { children } = props;
  const [isLoading, setIsLoading] = useState(true);
  const [isServer, setIsServer] = useState(true);

  const setUser = useUserStore((state) => state.setUser);

  const onGetUser = async () => {
    try {
      setIsLoading(true);
      const data = await getAuthUser();
      if (data?.id) {
        const { accounts, profiles, ...rest } = data;
        setUser({
          user: rest,
          accounts,
          profiles,
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
    setIsServer(false);
    onGetUser();

    return () => {};
  }, []);

  if (isServer) {
    return null;
  }
  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <SocketContextProvider>
      <Suspense fallback={<PageLoader />}>{children}</Suspense>
    </SocketContextProvider>
  );
}
