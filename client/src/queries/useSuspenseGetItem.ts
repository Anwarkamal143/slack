import {
  QueryKey,
  useSuspenseQuery,
  UseSuspenseQueryOptions,
} from "@tanstack/react-query";

import { ApiModelKey } from "@/types/query";
import {
  ApiModelDataTypes,
  ApiModelMapping,
  RequestOptions,
} from "./apiModelMapping";
type GetQueryParams<T extends ApiModelKey, K> = {
  modelName: T;
  slug?: string;
  requestOptions?: RequestOptions;
  queryOptions?: Partial<
    UseSuspenseQueryOptions<
      ApiModelDataTypes<K>[T] | undefined,
      unknown,
      ApiModelDataTypes<K>[T] | undefined,
      QueryKey
    >
  >;
  queryKey?: QueryKey;
};

export default function useSuspenseGetItem<T extends ApiModelKey, K = never>({
  modelName,
  slug,
  requestOptions = {},
  queryOptions = {},
  queryKey = [],
}: GetQueryParams<T, K extends never ? never : K>) {
  // const newQueryKeys = queryKey.filter((f) => f !== modelName);
  // const newQueryKey = newQueryKeys?.includes(slug)
  //   ? [modelName, ...newQueryKeys]
  //   : [modelName, ...newQueryKeys, slug];

  return useSuspenseQuery({
    queryKey: queryKey ? queryKey : [modelName, slug],
    // queryKey: newQueryKey,
    queryFn: async () => {
      if (slug) {
        const res = await ApiModelMapping[modelName].model.get<
          ApiModelDataTypes<K>[T]
        >(slug, requestOptions);
        return res.data;
      }
    },
    ...queryOptions,
  });
}
