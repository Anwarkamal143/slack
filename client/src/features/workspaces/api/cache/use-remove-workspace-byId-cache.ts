import { getQueryClient } from "@/get-query-client";
import { IPaginationMeta } from "@/types/Iresponse";
import { MEMBERS_KEYS } from "..";
import { IMemberWorkspaces } from "../../schemas";

type Props = {};

const useRemoveWorkspaceByIdCache = (workspaceId?: number) => {
  const queryClient = getQueryClient();

  const onRemoveWorkspcebyId = (workSpaceId?: number) => {
    const workspaceID = workSpaceId || workspaceId;
    if (!workspaceID) {
      return;
    }
    queryClient.setQueryData(
      [MEMBERS_KEYS.listCurrentMemberWorkspaces],
      (odlData: {
        data: IMemberWorkspaces[];
        pagination_meta: IPaginationMeta;
      }) => {
        if (odlData.data) {
          console.log(odlData);
          const newData = odlData.data.filter(
            (ws) => ws.workSpaceId !== workspaceID
          );
          odlData.data = newData;
          const newLength = odlData.data.length;
          const totalRecords = odlData.pagination_meta.totalRecords - 1;
          const pageSize = odlData.pagination_meta.pageSize;
          const hasNextPage = odlData.pagination_meta.hasNextPage;
          const currentPage = Math.ceil(newLength / pageSize) || 0;
          const totalPages = Math.ceil(totalRecords / pageSize) || 0;
          odlData.pagination_meta.totalPages = totalPages;
          odlData.pagination_meta.totalRecords = totalRecords;
          odlData.pagination_meta.hasNextPage =
            hasNextPage && totalPages > currentPage;
          odlData.pagination_meta.nextPage = currentPage + 1;
        }
        return odlData;
      }
    );
  };
  return onRemoveWorkspcebyId;
};

export default useRemoveWorkspaceByIdCache;
