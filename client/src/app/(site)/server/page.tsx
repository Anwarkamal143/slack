import { getServerUser } from "@/actions/auth.actions";
// import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

type Props = {};

const ServerPage = async (props: Props) => {
  const isAuthenticated = await getServerUser();

  if (!isAuthenticated?.id) {
    return redirect("/login");
  }

  return (
    <div>
      <div className="flex gap-2"></div>
      <h1>Server Cookies Data {JSON.stringify(isAuthenticated)}</h1>
    </div>
  );
};

export default ServerPage;
