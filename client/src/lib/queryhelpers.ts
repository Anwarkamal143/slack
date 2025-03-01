import { IPaginationMeta } from "@/types/Iresponse";

export const calculatePaginationMeta = <T>(
  items: T[],
  pagination_meta?: IPaginationMeta
) => {
  const paginationMeta = { ...(pagination_meta || {}) };
  const totalRecords = (paginationMeta?.totalRecords || 0) + 1;
  const totalPages = Math.ceil(totalRecords / (paginationMeta?.pageSize || 20));
  const page = Math.ceil(items.length / totalRecords);
  const nextPage = page + 1;
  return {
    ...(paginationMeta || {}),
    totalPages,
    totalRecords,
    page,
    nextPage,
  } as IPaginationMeta;
};
