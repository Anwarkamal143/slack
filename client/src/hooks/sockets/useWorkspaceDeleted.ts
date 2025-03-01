import { SOCKETS_KEYS } from "@/constants";
import useRemoveWorkspaceByIdCache from "@/features/workspaces/api/cache/use-remove-workspace-byId-cache";
import { IWorkSpace } from "@/features/workspaces/schemas";
import { useEffect } from "react";
import useSocket from "../useSocket";

const useWorkspaceDeleted = () => {
  const { socket } = useSocket();
  const removeWorkspace = useRemoveWorkspaceByIdCache();
  const onWorkspaceDelete = (data: IWorkSpace) => {
    if (data.id) {
      removeWorkspace(data.id);
    }
  };
  useEffect(() => {
    socket?.on(SOCKETS_KEYS.WORKSPACE_DELETED, onWorkspaceDelete);

    return () => {
      socket?.off(SOCKETS_KEYS.WORKSPACE_DELETED, onWorkspaceDelete);
    };
  }, []);

  return null;
};

export default useWorkspaceDeleted;
