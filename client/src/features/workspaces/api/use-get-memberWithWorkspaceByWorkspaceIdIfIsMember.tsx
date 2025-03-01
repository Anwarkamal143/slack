import { ApiModels } from "@/queries/apiModelMapping";
import useGetItem from "@/queries/useGetItem";
import { MEMBERS_KEYS, MEMBERS_QUERY_PATHS } from ".";
import { IMemberWorkspaces } from "../schemas";

export function useGetMemberWithWorkspaceByWorkspaceIdIfIsMember<T = never>(
  workspaceId?: number
) {
  // const { enabled, ...rest } = queryOptions;
  return useGetItem<
    typeof ApiModels.WorkspaceMembers,
    ReturnAIfNotB<IMemberWorkspaces, T>
  >({
    modelName: ApiModels.WorkspaceMembers,
    queryKey: MEMBERS_KEYS.getMemberWorkspaceByWorkspaceId(
      workspaceId as number
    ),
    slug: MEMBERS_QUERY_PATHS.getMemberWorkspaceByWorkspaceId,
    requestOptions: {
      query: {
        workspaceId,
      },
    },
    queryOptions: {
      enabled: !!workspaceId,
      networkMode: "online",
      retry: false,
    },
  });
}
