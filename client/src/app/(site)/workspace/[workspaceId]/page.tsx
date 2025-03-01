"use client";
import DataLoader from "@/components/data-loader";
import UserButton from "@/components/user-button";
import { useGetMemberWithWorkspaceByWorkspaceIdIfIsMember } from "@/features/workspaces/api";
import useWorkSpaceId from "@/hooks/useWorkSpaceId";
import { useRouter } from "next/navigation";

const WorkspacePage = () => {
  const worskSpaceId = useWorkSpaceId();
  const router = useRouter();
  const { isLoading, data } =
    useGetMemberWithWorkspaceByWorkspaceIdIfIsMember(worskSpaceId);

  if (isLoading) {
    return (
      <div className="h-full w-full bg-foreground flex justify-center items-center">
        <DataLoader />
      </div>
    );
  }
  if (!data?.data?.id) {
    router.replace("/");
  }

  return (
    <div>
      {JSON.stringify(data?.data)}
      <UserButton />
    </div>
  );
};

export default WorkspacePage;
