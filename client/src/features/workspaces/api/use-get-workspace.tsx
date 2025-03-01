import { ApiModels } from "@/queries/apiModelMapping";
import useGetItem from "@/queries/useGetItem";
import { WORKSPACES_KEYS } from ".";

export function useGetWorkspace(id?: number) {
  return useGetItem({
    modelName: ApiModels.Workspaces,
    queryKey: [WORKSPACES_KEYS.getWorkspaceById(id as number)],
    slug: `${id}`,
  });
}
