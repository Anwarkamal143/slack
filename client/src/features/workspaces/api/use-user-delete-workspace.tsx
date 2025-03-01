import { getQueryClient } from "@/get-query-client";
import { ApiModels } from "@/queries/apiModelMapping";
import useDeleteItem from "@/queries/useDeleteItem";
import { MEMBERS_KEYS, WORKSPACES_KEYS, WORKSPACES_QUERY_PATHS } from ".";

type Props = {};

const useUserDeleteWorkspace = (workspaceId?: number) => {
  const client = getQueryClient();

  const { mutateAsync, ...rest } = useDeleteItem({
    modelName: ApiModels.Workspaces,
    queryKey: [WORKSPACES_KEYS.deleteWorkspaceById(workspaceId)],
  });

  async function handleDelete(workSpaceId?: number) {
    const wId = workSpaceId || workspaceId;

    const data = await mutateAsync({
      slug: WORKSPACES_QUERY_PATHS.deleteWorkspaceById(wId),
      queryKey: [WORKSPACES_KEYS.deleteWorkspaceById(wId)],
      dataKey: "id",
    });
    client.invalidateQueries({
      queryKey: [MEMBERS_KEYS.listCurrentMemberWorkspaces],
    });
    client.invalidateQueries({
      queryKey: [MEMBERS_KEYS.listWorkSpaceMembers],
    });
    return data;
  }
  return { handleDelete, ...rest };
};

export default useUserDeleteWorkspace;
