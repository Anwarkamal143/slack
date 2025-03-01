"use client";

import CreateChannelModal from "@/features/channels/components/create-channel-modal";
import CreateWorkspaceModal from "@/features/workspaces/components/create-workspace-modal";

import { useEffect, useState } from "react";

type Props = {};

const Modals = (props: Props) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <CreateChannelModal />
      <CreateWorkspaceModal />
    </>
  );
};

export default Modals;
