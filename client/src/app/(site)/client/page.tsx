"use client";
import SignOutButton from "@/components/SignOutButton";
import useUserStore from "@/store/userStore";
type Props = {};

const DashboardPage = (props: Props) => {
  const store = useUserStore((state) => state.profiles);

  return (
    <div className="h-full flex flex-col space-y-3 items-center justify-center bg-gray-100">
      <h1>
        You&apos;re logged In as{" "}
        <em className="bg-gray-400 text-gray-200 p-2 rounded-lg">
          {store?.[0]?.name}
        </em>{" "}
      </h1>
      <SignOutButton />
    </div>
  );
};

export default DashboardPage;
