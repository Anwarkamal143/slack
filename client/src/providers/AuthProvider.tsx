"use client";
import { useUserStoreIsAuthenticated } from "@/store/userUserStore";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
type Props = {
  children: ReactNode;
};

export default function AuthProvider(props: Props) {
  const { children } = props;

  const router = useRouter();
  const isAuthenticated = useUserStoreIsAuthenticated();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    }
    return () => {};
  }, [isAuthenticated]);

  return <>{children}</>;
}
