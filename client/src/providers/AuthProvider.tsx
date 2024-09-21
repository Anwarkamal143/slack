"use client";
import { getAuthUser } from "@/api/auth";
import useUserStore from "@/store/userStore";
import { ReactNode, Suspense, useEffect, useState } from "react";
import PageLoader from "../components/loader";
import SocketContextProvider from "./SocketProvider";
type Props = {
  children: ReactNode;
};

const AuthProvider = (props: Props) => {
  const { children } = props;
  const [isLoading, setIsLoading] = useState(false);
  const isServer = typeof window == undefined;
  const setUser = useUserStore((state) => state.setUser);

  const onGetUser = async () => {
    if (isServer) return;
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
    onGetUser();

    return () => {};
  }, [isServer]);

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <SocketContextProvider>
      <Suspense key={Date.now()} fallback={<PageLoader />}>
        {children}
      </Suspense>
    </SocketContextProvider>
  );
};

export default AuthProvider;
