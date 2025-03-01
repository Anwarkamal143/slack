import { getQueryClient } from "@/get-query-client";
import { ApiModels } from "@/queries/apiModelMapping";
import useCreateItem from "@/queries/useCreateItem";
import { MEMBERS_KEYS, WORKSPACES_KEYS } from ".";
import { IMemberWorkspaces } from "../schemas";

export function useCreateWorkSpace<T = never>(isPaginated: boolean = false) {
  const client = getQueryClient();
  const { mutateAsync, isError, isPending, isSuccess, error } = useCreateItem<
    typeof ApiModels.Workspaces,
    ReturnAIfNotB<IMemberWorkspaces, T>
  >({
    modelName: ApiModels.Workspaces,
    queryKey: [WORKSPACES_KEYS.createWorkspace],
    isPaginated,
  });

  const handleCreateWorkSpace = async (data: { name: string }) => {
    const createdWorkspace = await mutateAsync({
      data,
    });

    client.invalidateQueries({
      queryKey: [MEMBERS_KEYS.listCurrentMemberWorkspaces],
    });
    client.invalidateQueries({
      queryKey: [MEMBERS_KEYS.listWorkSpaceMembers],
    });

    return createdWorkspace;
  };

  return { handleCreateWorkSpace, isError, isPending, isSuccess, error };
}
