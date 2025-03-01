import { getQueryClient } from "@/get-query-client";
import { calculatePaginationMeta } from "@/lib/queryhelpers";
import { ApiModels } from "@/queries/apiModelMapping";
import useCreateItem from "@/queries/useCreateItem";
import { IApiResponse } from "@/types/Iresponse";
import { CHANNELS_KEYS } from ".";
import { IChannel, ICreateChannle } from "../schema";

export const useCreateUserChannel = (workspaceId?: number) => {
  const client = getQueryClient();
  const { mutateAsync, isError, isPending, isSuccess, error } = useCreateItem<
    typeof ApiModels.Channels,
    ICreateChannle
  >({
    modelName: ApiModels.Channels,
    queryKey: [CHANNELS_KEYS.create_channel],
  });

  const handleCreateChannel = async (
    data: { name: string },
    workSpaceId?: number
  ) => {
    const wsId = workSpaceId || workspaceId;
    if (!wsId) {
      throw new Error("Workspace Id is required");
    }
    const createdChannel = await mutateAsync({
      data,
      requestOptions: {
        query: {
          workspaceId: wsId,
        },
      },
    });
    if (createdChannel.data) {
      console.log({ createdChannel });
      client.setQueryData(
        [CHANNELS_KEYS.list_channels(wsId)],

        (data: IApiResponse<IChannel[]>) => {
          console.log({ data });
          const newData = { ...data };
          let channels = [...(newData.data || [])];
          const newChannel: IChannel = createdChannel.data?.channel as IChannel;
          if (newChannel) {
            channels = [newChannel, ...channels];
          }
          const paginationMeta = newData.pagination_meta;
          newData.pagination_meta = calculatePaginationMeta(
            channels,
            paginationMeta
          );
          newData.data = channels;
          return newData;
        }
      );
    }
    // client.invalidateQueries({
    //   queryKey: [CHANNELS_KEYS.list_channels(wsId)],
    // });
    return createdChannel;
  };

  return { handleCreateChannel, isError, isPending, isSuccess, error };
};
