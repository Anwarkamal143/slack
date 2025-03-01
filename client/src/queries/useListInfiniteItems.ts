import {
  QueryKey,
  useInfiniteQuery,
  UseInfiniteQueryOptions,
} from "@tanstack/react-query";

import { IApiResponse, IPaginationMeta } from "@/types/Iresponse";
import { ApiModelKey } from "@/types/query";
import {
  ApiModelDataTypes,
  ApiModelMapping,
  RequestOptions,
} from "./apiModelMapping";
type WithType<L extends ApiModelKey, M> = [M] extends [never]
  ? ApiModelDataTypes[L][]
  : ApiModelDataTypes<M>[L][];
type ListQueryParams<T extends ApiModelKey, K> = {
  modelName: T;
  queryKey?: QueryKey;
  requestOptions?: RequestOptions;
  // queryOptions?: UseInfiniteQueryOptions;
  queryOptions?: Omit<
    UseInfiniteQueryOptions,
    // UseInfiniteQueryOptions<
    //   IApiResponse<WithType<T, K>>,
    //   unknown,
    //   IApiResponse<WithType<T, K>>,
    //   QueryKey
    // >,
    "queryKey" | "queryFn"
  >;
  isCursorBased?: boolean;
  limit?: number;
};

export default function useListInfiniteItems<T extends ApiModelKey, K = never>({
  modelName,
  requestOptions = {},
  queryOptions,
  queryKey = [],
  isCursorBased = false,
  limit = 2,
}: ListQueryParams<T, K extends never ? never : K>) {
  const newQueryKeys = queryKey.filter((f) => f !== modelName);
  // const newQueryKey = [modelName, ...newQueryKeys];
  const newQueryKey = [...newQueryKeys];
  const { initialPageParam = 1, ...rest } = queryOptions || {
    initialPageParam: 1,
  };
  return useInfiniteQuery<IApiResponse<ApiModelDataTypes[T][]>>({
    queryKey: newQueryKey,
    initialPageParam: initialPageParam,
    queryFn: async ({ pageParam }) => {
      const options = {
        ...requestOptions,
        query: { page: pageParam, limit, ...requestOptions.query },
      };
      const res = await ApiModelMapping[modelName].model.list<
        ApiModelDataTypes<K>[T]
      >(options);
      const { success, message, ...rest } = res;
      return rest;
    },

    getNextPageParam: (lastPage, pages, lastPageParam, allPagesParam) => {
      // console.log({ lastPage, pages, lastPageParam, allPagesParam });
      const { hasNextPage, nextCursor } = (lastPage.pagination_meta ||
        {}) as IPaginationMeta;
      if (isCursorBased) {
        return hasNextPage ? nextCursor : undefined;
      }
      return hasNextPage ? pages.length : undefined;
      // return pages.length * 25;
    },
    ...((rest || {}) as any),
  });
}
