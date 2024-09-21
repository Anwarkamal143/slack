"use client";
import { getServerUser } from "@/actions/auth.actions";

import { Button } from "@/components/ui/button";
// import useIsAuth from "@/hooks/useIsAuth";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [data, setData] = useState<IServerCookieType | null>(null);
  // useIsAuth();

  return (
    <div className="h-full w-full flex items-center justify-center">
      <div>
        <div className="flex gap-2">
          <Button onClick={() => router.push("/client")}>Client</Button>
          <Button onClick={() => router.push("/server")}>Server</Button>

          <Button
            onClick={async () => {
              const data = await getServerUser();
              console.log(data, "data");
              setData(data);
            }}
          >
            Get Server User
          </Button>
        </div>
        <div className="">{JSON.stringify(data)}</div>
      </div>
    </div>
  );
}
