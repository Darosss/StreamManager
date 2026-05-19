import Axios from "axios";
import { viteBackendUrl } from "@configs/envVariables";
import { QueryClient } from "@tanstack/react-query";
import { QueryParams } from "./types";

export const queryKeysParamsHelper = <ParamsType extends string>(
  params?: QueryParams<ParamsType>,
) => {
  return params ? JSON.stringify(params) : "";
};

export const customAxios = Axios.create({
  baseURL: viteBackendUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

export const refetchDataFunctionHelper = <
  QueryKeysType extends Record<
    string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    string[] | ((...args: any[]) => string[])
  >,
  Key extends keyof QueryKeysType,
>(
  queryStrings: QueryKeysType,
  queryKey: Key,
  queryClient: QueryClient,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: QueryKeysType[Key] extends (...args: any[]) => any[]
    ? Parameters<QueryKeysType[Key]>
    : null | undefined,
  exact = false,
) => {
  const queryKeyValue = queryStrings[queryKey];

  const finalQueryKey =
    typeof queryKeyValue === "function"
      ? queryKeyValue(...(params || []))
      : (queryKeyValue as string[]);

  return () =>
    queryClient.invalidateQueries<readonly string[]>({
      queryKey: finalQueryKey,
      exact,
    });
};
