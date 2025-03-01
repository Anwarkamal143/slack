import { ApiModels } from "@/queries/apiModelMapping";
import useListItems from "@/queries/useListItems";
import { WORKSPACES_KEYS, WORKSPACES_QUERY_PATHS } from ".";

export function useGetUserWorkSpaces(
  enabled: boolean | undefined | string = true
) {
  return useListItems({
    modelName: ApiModels.Workspaces,
    queryKey: [WORKSPACES_KEYS.listWorkspaces],
    requestOptions: {
      path: WORKSPACES_QUERY_PATHS.getCurrentUserWorkspaces,
    },
    queryOptions: {
      enabled: !!enabled,
      // gcTime: 10000,
    },
  });
}
