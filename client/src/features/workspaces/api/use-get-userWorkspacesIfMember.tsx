import { ApiModels } from "@/queries/apiModelMapping";
import useListItems from "@/queries/useListItems";
import { UseQueryOptions } from "@tanstack/react-query";
import { MEMBERS_KEYS, MEMBERS_QUERY_PATHS } from ".";
import { IMemberWorkspaces } from "../schemas";

export function useGetUserWorkspacesIfIsMember<T = never>(
  enabled: boolean,
  networkMode?: UseQueryOptions["networkMode"]
) {
  return useListItems<
    typeof ApiModels.WorkspaceMembers,
    ReturnAIfNotB<IMemberWorkspaces, T>
  >({
    modelName: ApiModels.WorkspaceMembers,
    queryKey: [MEMBERS_KEYS.listCurrentMemberWorkspaces],

    requestOptions: {
      path: MEMBERS_QUERY_PATHS.getMembersOfaWorkspaceByUserId,
    },
    queryOptions: {
      enabled,
      ...(networkMode ? { networkMode } : {}),
    },
  });
}
