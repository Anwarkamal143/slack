import { ApiModels } from "@/queries/apiModelMapping";
import useListInfiniteItems from "@/queries/useListInfiniteItems";
import { MEMBERS_KEYS, MEMBERS_QUERY_PATHS } from ".";

export function useGetInfinteCurrentMemberWorkspaces() {
  return useListInfiniteItems({
    modelName: ApiModels.WorkspaceMembers,
    queryKey: [MEMBERS_KEYS.listPaginatedCurrentMemberWorkspaces],
    // limit: 1,
    requestOptions: {
      path: MEMBERS_QUERY_PATHS.getMembersOfaWorkspaceByUserId,
    },
  });
}
