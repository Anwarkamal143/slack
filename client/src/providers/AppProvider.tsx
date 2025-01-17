"use client";
import useFetchUser from "@/hooks/useFetchUser";
import { ReactNode, Suspense } from "react";
import PageLoader from "../components/loader";
import SocketContextProvider from "./SocketProvider";
type Props = {
  children: ReactNode;
};

export default function AppProvider(props: Props) {
  const { children } = props;
  const { isLoading, isServer } = useFetchUser();

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
