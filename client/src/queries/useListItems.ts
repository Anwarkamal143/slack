import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query";

import { IRequestOptions } from "@/models";
import { IApiResponse } from "@/types/Iresponse";
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
  queryKey: QueryKey;
  requestOptions?: RequestOptions & { requestOptions?: IRequestOptions };
  queryOptions?: Partial<
    UseQueryOptions<
      IApiResponse<WithType<T, K>>,
      unknown,
      IApiResponse<WithType<T, K>>,
      QueryKey
    >
  >;
};
export default function useListItems<T extends ApiModelKey, K = never>({
  modelName,
  requestOptions = {},
  queryOptions = {},
  queryKey,
}: ListQueryParams<T, K extends never ? never : K>) {
  // const newQueryKeys = queryKey.filter((f) => f !== modelName);
  // const newQueryKey = [modelName, ...newQueryKeys];

  return useQuery({
    // queryKey: newQueryKey,
    queryKey: queryKey,

    queryFn: async () => {
      const res = await ApiModelMapping[modelName].model.list(requestOptions);
      const { status, message, time, success, ...rest } = res;
      return rest as IApiResponse<WithType<T, K>>;
    },

    ...queryOptions,
  });
}
