"use client";

import DataLoader from "@/components/data-loader";
import { Button } from "@/components/ui/button";
import { useGetUserWorkspacesIfIsMember } from "@/features/workspaces/api";
import {
  useCreateWorkspaceModalStoreActions,
  useCreateWorkspaceModalStoreIsOpen,
} from "@/features/workspaces/store/use-create-workspace-modal";
import { useUserStoreStoreUser } from "@/store/userUserStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const userId = useUserStoreStoreUser()?.id;
  const { setModalOpen } = useCreateWorkspaceModalStoreActions();
  const isOpen = useCreateWorkspaceModalStoreIsOpen();
  const { isLoading, data } = useGetUserWorkspacesIfIsMember(!!userId);

  const workSpaceId = data?.data?.[0]?.workSpaceId;

  useEffect(() => {
    if (isLoading) return;

    if (workSpaceId) {
      console.log("Redirecting to workspace");
      router.replace(`/workspace/${workSpaceId}`);
    } else if (!isOpen) {
      setModalOpen(true);
    }
    return () => {};
  }, [isLoading, workSpaceId]);

  if (isLoading) {
    return (
      <div className="h-full w-full flex gap-2 justify-center items-center">
        <DataLoader />
      </div>
    );
  }
  return (
    <div className="h-full w-full flex gap-2 justify-center items-center bg-slack-bg">
      <Button
        variant={"transparent"}
        className="border border-slack-channel"
        onClick={() => setModalOpen(true)}
      >
        Create Workspace
      </Button>
    </div>
  );
}
