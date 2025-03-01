import { ApiModels } from "@/queries/apiModelMapping";
import useListItems from "@/queries/useListItems";
import { MEMBERS_KEYS, MEMBERS_QUERY_PATHS } from ".";

export function useGetMemberWorkspacesByUserIdIfIsMember(userId: string) {
  return useListItems({
    modelName: ApiModels.WorkspaceMembers,
    queryKey: [MEMBERS_KEYS.listMemberWorkspacesByUserId, userId],
    requestOptions: {
      path: MEMBERS_QUERY_PATHS.getMembersOfaWorkspaceByUserId,
      query: { userId },
    },
    queryOptions: {
      enabled: !!userId,
    },
  });
}
