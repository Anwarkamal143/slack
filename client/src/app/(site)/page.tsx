"use client";

import { Button } from "@/components/ui/button";
import UserButton from "@/components/ui/user-button";
import useUserStore from "@/store/userStore";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);

  return (
    <div className="h-full w-full flex items-center justify-center">
      <div>
        <div className="flex gap-2 justify-center items-center">
          <UserButton />
          <Button onClick={() => router.push("/client")}>Client</Button>
          <Button onClick={() => router.push("/server")}>Server</Button>

          {user?.name}
        </div>
      </div>
    </div>
  );
}
