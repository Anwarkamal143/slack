"use client";
import useUserStore from "@/store/userStore";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
type Props = {
  children: ReactNode;
};

export default function AuthProvider(props: Props) {
  const { children } = props;

  const router = useRouter();
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    }
    return () => {};
  }, [isAuthenticated]);

  return <>{children}</>;
}
