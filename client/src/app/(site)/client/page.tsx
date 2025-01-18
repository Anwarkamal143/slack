"use client";
import UserButton from "@/components/user-button";
import useUserStore from "@/store/userStore";
type Props = {};

const DashboardPage = (props: Props) => {
  const user = useUserStore((state) => state.user);

  return (
    <div className="h-full flex flex-col space-y-3 items-center justify-center bg-gray-100">
      <h1>
        You&apos;re logged In as{" "}
        <em className="bg-gray-400 text-gray-200 p-2 rounded-lg">
          {user?.name}
        </em>{" "}
      </h1>
      <UserButton />
    </div>
  );
};

export default DashboardPage;
