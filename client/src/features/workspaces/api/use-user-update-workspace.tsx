import { getQueryClient } from "@/get-query-client";
import { ApiModels } from "@/queries/apiModelMapping";
import useUpdateItem from "@/queries/useUpdateItem";
import { MEMBERS_KEYS, WORKSPACES_KEYS } from ".";
import { IWorkSpaceUpdate, WORKSPACE_UPDATE_SCEHEMA } from "../schemas";
import useUserUpdateWorkspaceCache from "./cache/use-user-update-workspace-cache";

export function useUserUpdateWorkspace(workspaceId?: number) {
  const queryClient = getQueryClient();
  const { mutateAsync, ...rest } = useUpdateItem({
    modelName: ApiModels.Workspaces,
    dataKey: "id",
    listQueryKey: [WORKSPACES_KEYS.getWorkspaceById(workspaceId)],
  });
  const handleCacheUpdate = useUserUpdateWorkspaceCache();
  async function handleUpdateWorkspace(
    data: IWorkSpaceUpdate,
    workSpaceId?: number
  ) {
    const parseResult = WORKSPACE_UPDATE_SCEHEMA.safeParse(data);

    if (!parseResult.success) {
      // throw new Error(parseResult.error.errors[0].message);
      return { data: null, error: parseResult.error.errors[0] };
    }
    const workspaceData = parseResult.data;
    try {
      const workspaceIdUpdated = workSpaceId || workspaceId;
      const updatedWorkspace = await mutateAsync({
        data: workspaceData,
        slug: workspaceIdUpdated + "",
        dataKey: "id",
        listQueryKey: ["workspaces", workspaceId],
      });
      handleCacheUpdate(updatedWorkspace, workspaceIdUpdated);
      queryClient.invalidateQueries({
        queryKey: [MEMBERS_KEYS.listCurrentMemberWorkspaces],
      });
      console.log({ queryClientcache: queryClient.getQueryCache() });

      queryClient.invalidateQueries({
        queryKey: [WORKSPACES_KEYS.getWorkspaceById(workspaceIdUpdated)],
      });
      return { data: updatedWorkspace, error: null };
    } catch (error: any) {
      throw new Error(error.message || "Workspace not updated");
    }
  }

  return { handleUpdateWorkspace, ...rest };
}
