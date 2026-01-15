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
  FetchOverlaysParams,
  Overlay,
  OverlayCreateData,
  OverlaysUpdateData,
} from "./types";
import { socketConn } from "@socket";
import { MutationAction, MutationEntity, useCustomMutation } from "@hooks";

export const fetchOverlaysDefaultParams: Required<FetchOverlaysParams> = {
  limit: 10,
  page: 1,
  search_name: "",
  sortOrder: "desc",
  sortBy: "createdAt",
};

const baseEndpointName = BaseEndpointNames.OVERLAYS;
export const queryKeysOverlays = {
  allOverlays: (params?: QueryParams<keyof FetchOverlaysParams>) => [
    "overlays",
    ...(params ? Object.entries(params).join(",") : []),
  ],
  overlayById: (id: string) => ["overlay", id] as [string, string],
};

export const fetchOverlays = async (
  params?: QueryParams<keyof FetchOverlaysParams>
): PromisePaginationData<Overlay> => {
  const response = await customAxios.get(`/${baseEndpointName}`, { params });
  return response.data;
};

export const fetchOverlayById = async (
  id: string
): PromiseBackendData<Overlay> => {
  const response = await customAxios.get(`/${baseEndpointName}/${id}`);
  return response.data;
};

export const createOverlay = async (
  newOverlays: OverlayCreateData
): PromiseBackendData<Overlay> => {
  const response = await customAxios.post(
    `/${baseEndpointName}/create`,
    newOverlays
  );
  return response.data;
};

export const editOverlay = async ({
  id,
  updatedOverlay,
}: {
  id: string;
  updatedOverlay: OverlaysUpdateData;
}): PromiseBackendData<Overlay> => {
  const response = await customAxios.patch(
    `/${baseEndpointName}/${id}`,
    updatedOverlay
  );
  return response.data;
};

export const duplicateOverlay = async (id: string) => {
  const response = await customAxios.post(
    `/${baseEndpointName}/duplicate/${id}`
  );
  return response.data;
};

export const deleteOverlay = async (
  id: string
): PromiseBackendData<Overlay> => {
  const response = await customAxios.delete(
    `/${baseEndpointName}/delete/${id}`
  );
  return response.data;
};

export const useGetOverlays = (
  params?: QueryParams<keyof FetchOverlaysParams>
) => {
  return useQuery({
    queryKey: queryKeysOverlays.allOverlays(params),
    queryFn: () => fetchOverlays(params),
  });
};

export const useEditOverlay = () => {
  const refetchOverlays = useRefetchOverlaysData();
  return useCustomMutation(
    editOverlay,
    {
      entity: MutationEntity.OVERLAY,
      action: MutationAction.EDIT,
    },
    {
      onSuccess: async (_, params) => {
        await refetchOverlays();
        socketConn.emit("refreshOverlayLayout", params.id);
      },
    }
  );
};

export const useDuplicateOverlay = (id: string) => {
  const refetchOverlays = useRefetchOverlaysData();
  return useCustomMutation(
    () => duplicateOverlay(id),
    {
      entity: MutationEntity.OVERLAY,
      action: MutationAction.DUPLICATE,
    },
    {
      onSuccess: () => refetchOverlays(),
    }
  );
};

export const useCreateOverlay = () => {
  const refetchOverlays = useRefetchOverlaysData();
  return useCustomMutation(
    createOverlay,
    {
      entity: MutationEntity.OVERLAY,
      action: MutationAction.CREATE,
    },
    {
      onSuccess: refetchOverlays,
    }
  );
};

export const useDeleteOverlay = () => {
  const refetchOverlays = useRefetchOverlaysData();
  return useCustomMutation(
    deleteOverlay,
    {
      entity: MutationEntity.OVERLAY,
      action: MutationAction.DELETE,
    },
    {
      onSuccess: refetchOverlays,
    }
  );
};

export const useGetOverlayById = (id: string) => {
  return useQuery({
    queryKey: queryKeysOverlays.overlayById(id),
    queryFn: () => fetchOverlayById(id),
  });
};

export const useRefetchOverlaysData = (exact = false) => {
  const queryClient = useQueryClient();
  return refetchDataFunctionHelper(
    queryKeysOverlays,
    "allOverlays",
    queryClient,
    [],
    exact
  );
};

export const useRefetchOverlayById = (exact = false) => {
  const queryClient = useQueryClient();
  return (id: string) =>
    refetchDataFunctionHelper(
      queryKeysOverlays,
      "overlayById",
      queryClient,
      [id],
      exact
    );
};
