import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BaseEndpointNames,
  QueryParams,
  PromisePaginationData,
  customAxios,
  PromiseBackendData,
  refetchDataFunctionHelper,
} from "../api";
import {
  FetchAffixParams,
  Affix,
  AffixCreateData,
  AffixUpdateData,
} from "./types";
import { socketConn } from "@socket";
import { MutationAction, MutationEntity, useCustomMutation } from "@hooks";

export const fetchAffixesDefaultParams: Required<FetchAffixParams> = {
  limit: 10,
  page: 1,
  search_name: "",
  sortOrder: "asc",
  sortBy: "createdAt",
};

const baseEndpointName = BaseEndpointNames.AFFIXES;
export const queryKeysAffixes = {
  allAffixes: (params?: QueryParams<keyof FetchAffixParams>) => [
    "affixes",
    ...(params ? Object.entries(params).join(",") : []),
  ],
};

export const fetchAffixes = async (
  params?: QueryParams<keyof FetchAffixParams>
): PromisePaginationData<Affix> => {
  const response = await customAxios.get(`/${baseEndpointName}`, { params });
  return response.data;
};

export const createAffix = async (
  newAffix: AffixCreateData
): PromiseBackendData<Affix> => {
  const response = await customAxios.post(
    `/${baseEndpointName}/create`,
    newAffix
  );
  return response.data;
};

export const editAffix = async ({
  id,
  updatedAffix,
}: {
  id: string;
  updatedAffix: AffixUpdateData;
}): PromiseBackendData<Affix> => {
  const response = await customAxios.patch(
    `/${baseEndpointName}/${id}`,
    updatedAffix
  );
  return response.data;
};

export const deleteAffix = async (id: string): PromiseBackendData<Affix> => {
  const response = await customAxios.delete(
    `/${baseEndpointName}/delete/${id}`
  );
  return response.data;
};

export const useGetAffixes = (params?: QueryParams<keyof FetchAffixParams>) => {
  return useQuery({
    queryKey: queryKeysAffixes.allAffixes(params),
    queryFn: () => fetchAffixes(params),
  });
};

export const useEditAffix = () => {
  const refetchAffixes = useRefetchAffixesData();
  return useCustomMutation(
    editAffix,
    {
      entity: MutationEntity.AFFIX,
      action: MutationAction.EDIT,
    },
    {
      onSuccess: () => {
        refetchAffixes().then(() => {
          socketConn.emit("changeModes");
        });
      },
    }
  );
};

export const useCreateAffix = () => {
  const refetchAffixes = useRefetchAffixesData();
  return useCustomMutation(
    createAffix,
    {
      entity: MutationEntity.AFFIX,
      action: MutationAction.CREATE,
    },
    {
      onSuccess: () => {
        refetchAffixes().then(() => {
          socketConn.emit("changeModes");
        });
      },
    }
  );
};

export const useDeleteAffix = () => {
  const refetchAffixes = useRefetchAffixesData();
  return useCustomMutation(
    deleteAffix,
    {
      entity: MutationEntity.AFFIX,
      action: MutationAction.DELETE,
    },
    {
      onSuccess: () => {
        refetchAffixes().then(() => {
          socketConn.emit("changeModes");
        });
      },
    }
  );
};
export const useRefetchAffixesData = (exact = false) => {
  const queryClient = useQueryClient();
  return refetchDataFunctionHelper(
    queryKeysAffixes,
    "allAffixes",
    queryClient,
    [],
    exact
  );
};
