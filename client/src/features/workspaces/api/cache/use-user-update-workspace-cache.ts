import { getQueryClient } from "@/get-query-client";
import { MEMBERS_KEYS } from "..";
import { IWorkSpace } from "../../schemas";

type Props = {};

const useUserUpdateWorkspaceCache = (workspaceId?: number) => {
  const queryClient = getQueryClient();

  const handleUpdateCache = (data: IWorkSpace, workSpaceId?: number) => {
    const workspaceID = workSpaceId || workspaceId;
    if (!workspaceID) {
      return;
    }
    queryClient.setQueryData(
      MEMBERS_KEYS.getMemberWorkspaceByWorkspaceId(workspaceID),
      (odlData: { data: IWorkSpace }) => {
        if (odlData?.data) {
          const modifiedWorkspaceData = {
            ...odlData.data,
            workSpace: data,
          };
          return { ...odlData, data: modifiedWorkspaceData };
        }
        return odlData;
      }
    );
  };
  return handleUpdateCache;
};

export default useUserUpdateWorkspaceCache;
