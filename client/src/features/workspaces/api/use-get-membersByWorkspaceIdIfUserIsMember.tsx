import { ApiModels } from "@/queries/apiModelMapping";
import useListItems from "@/queries/useListItems";
import { MEMBERS_KEYS, MEMBERS_QUERY_PATHS } from ".";
import { IWorkspaceMemebrsWithUsers } from "../schemas";

export function useGetMembersByWorkspaceIdIfUserisMember(workspaceId?: number) {
  return useListItems<
    typeof ApiModels.WorkspaceMembers,
    IWorkspaceMemebrsWithUsers
  >({
    modelName: ApiModels.WorkspaceMembers,
    queryKey: [MEMBERS_KEYS.listWorkSpaceMembers],
    requestOptions: {
      path: MEMBERS_QUERY_PATHS.getMembersOfaWorkspace,
      query: { workspaceId },
    },
    queryOptions: {
      enabled: !!workspaceId,
    },
  });
}
