"use client";
import SignOutButton from "@/components/SignOutButton";
import useAuth from "@/hooks/useIsAuth";
import useUserStore from "@/store/userStore";
type Props = {};

const DashboardPage = (props: Props) => {
  useAuth();
  const store = useUserStore((state) => state.profiles);

  return (
    <div>
      <h1>You&apos;re logged In as {store?.[0]?.name}</h1>
      <SignOutButton />
    </div>
  );
};

export default DashboardPage;
