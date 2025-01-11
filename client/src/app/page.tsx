"use client";
import { getCookieUser } from "@/actions/auth.actions";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [data, setData] = useState<IServerCookieType | null>(null);

  const keys = data ? (Object.keys(data) as [keyof IServerCookieType]) : [];
  return (
    <div className="h-full w-full flex items-center justify-center">
      <div>
        <div className="flex gap-2 justify-center items-center">
          <Button onClick={() => router.push("/client")}>Client</Button>
          <Button onClick={() => router.push("/server")}>Server</Button>

          <Button
            onClick={async () => {
              const data = await getCookieUser();
              console.log(data, "data");

              setData(data);
            }}
          >
            Get Server User
          </Button>
        </div>
        {keys.length > 0 ? (
          <ul className="  space-y-2 bg-gray-100 p-5 mt-5 rounded-lg">
            {keys.map((k: keyof IServerCookieType) => {
              const keyData = data?.[k];
              return (
                <li
                  key={k}
                  className="bg-gray-500 text-white p-4 hover:bg-gray-200 hover:cursor-pointer hover:text-gray-700  rounded-full"
                >
                  {k}: {keyData}
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
