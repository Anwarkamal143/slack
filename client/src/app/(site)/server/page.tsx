// import { Button } from "@/components/ui/button";

import { getCookieUser } from "@/actions/auth.actions";
import { redirect } from "next/navigation";

type Props = {};

const ServerPage = async (props: Props) => {
  const isAuthenticated = await getCookieUser();
  if (!isAuthenticated?.id) {
    return redirect("/login");
  }
  const keys = isAuthenticated
    ? (Object.keys(isAuthenticated) as [keyof IServerCookieType])
    : [];
  return (
    <div className="flex flex-col justify-center items-center h-full">
      <h1 className="font-semibold border-b border-gray-200 text-gray-600   text-3xl">
        Server User
      </h1>
      {keys.length > 0 ? (
        <ul className=" max-w-md mx-auto  space-y-2 bg-gray-100 p-5 mt-5 rounded-lg">
          {keys.map((k: keyof IServerCookieType) => {
            const keyData = isAuthenticated?.[k];
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
  );
};

export default ServerPage;
