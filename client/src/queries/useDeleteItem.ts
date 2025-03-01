import {
  QueryKey,
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";

import { isArray } from "@/lib";
import { ApiModelKey } from "@/types/query";
import {
  ApiModelDataTypes,
  ApiModelMapping,
  RequestOptions,
} from "./apiModelMapping";
type DeleteMutationParams<T extends ApiModelKey, K> = {
  modelName: T;
  requestOptions?: RequestOptions;
  mutationOptions?: Pick<UseMutationOptions, "mutationKey">;
  dataKey?: keyof ApiModelDataTypes[T];
  queryKey?: QueryKey;
  listQueryKey?: QueryKey;
};

export default function useDeleteItem<T extends ApiModelKey, K = never>({
  modelName,
  requestOptions = {},
  mutationOptions = {},
  dataKey,
  listQueryKey = [],
  queryKey = [],
}: DeleteMutationParams<T, K extends never ? never : K>) {
  const { model } = ApiModelMapping[modelName] || {};
  const queryClient = useQueryClient();

  return useMutation<
    ApiModelDataTypes<K>[T],
    unknown,
    {
      slug: string;
      queryKey?: QueryKey;
      listQueryKey?: QueryKey;
      dataKey?: keyof ApiModelDataTypes[T];
    }
  >({
    ...mutationOptions,
    mutationFn: async ({ slug }) => {
      const res = await model?.delete(slug, requestOptions);

      return res.data as ApiModelDataTypes<K>[T];
    },
    onSuccess: (
      _,
      { slug, dataKey: dk = null, listQueryKey: lk = [], queryKey: qk = [] }
    ) => {
      let defaultQueryKey = qk.length ? qk : queryKey.length ? queryKey : [];
      const withoutmodelandslug = defaultQueryKey
        .filter((f) => f != modelName)
        .filter((a) => a !== slug);
      defaultQueryKey = [modelName, ...withoutmodelandslug, slug];
      queryClient.removeQueries({
        queryKey: defaultQueryKey,
        exact: true,
      });
      let lsQueryKey = lk.length ? lk : listQueryKey.length ? listQueryKey : [];
      lsQueryKey = lsQueryKey.filter((lf) => lf != modelName);
      lsQueryKey = [modelName, ...lsQueryKey];
      queryClient.setQueryData(
        lsQueryKey,
        (oldData: ApiModelDataTypes[T][] = []) => {
          if (isArray(oldData)) {
            return oldData.filter(
              (item) => (item as any)[dk || dataKey || "slug"] !== slug
            );
          }

          return oldData;
        }
      );
    },
  });
}
