import { ApiModels } from "@/queries/apiModelMapping";
import useListItems from "@/queries/useListItems";
import { CHANNELS_KEYS } from ".";

export function useGetUserChannelsByWorkspaceId(workspaceId?: number) {
  return useListItems({
    modelName: ApiModels.Channels,
    queryKey: [CHANNELS_KEYS.list_channels(workspaceId)],
    requestOptions: {
      query: { workspaceId },
    },
    queryOptions: {
      enabled: !!workspaceId,
    },
  });
}
