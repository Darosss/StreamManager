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
  FetchTriggerParams,
  Trigger,
  TriggerCreateData,
  TriggerUpdateData,
} from "./types";
import { socketConn } from "@socket";
import { MutationAction, MutationEntity, useCustomMutation } from "@hooks";

export const fetchTriggersDefaultParams: Required<FetchTriggerParams> = {
  limit: 10,
  page: 1,
  search_name: "",
  sortOrder: "desc",
  sortBy: "createdAt",
  words: "",
  messages: "",
  start_date: "",
  end_date: "",
};

const baseEndpointName = BaseEndpointNames.TRIGGERS;
export const queryKeysTriggers = {
  allTriggers: (params?: QueryParams<keyof FetchTriggerParams>) => [
    "triggers",
    ...(params ? Object.entries(params).join(",") : []),
  ],
};

export const fetchTriggers = async (
  params?: QueryParams<keyof FetchTriggerParams>
): PromisePaginationData<Trigger> => {
  const response = await customAxios.get(`/${baseEndpointName}`, { params });
  return response.data;
};

export const createTrigger = async (
  newTrigger: TriggerCreateData
): PromiseBackendData<Trigger> => {
  const response = await customAxios.post(
    `/${baseEndpointName}/create`,
    newTrigger
  );
  return response.data;
};

export const editTrigger = async ({
  id,
  updatedTrigger,
}: {
  id: string;
  updatedTrigger: TriggerUpdateData;
}): PromiseBackendData<Trigger> => {
  const response = await customAxios.patch(
    `/${baseEndpointName}/${id}`,
    updatedTrigger
  );
  return response.data;
};

export const deleteTrigger = async (
  id: string
): PromiseBackendData<Trigger> => {
  const response = await customAxios.delete(
    `/${baseEndpointName}/delete/${id}`
  );
  return response.data;
};

export const useGetTriggers = (
  params?: QueryParams<keyof FetchTriggerParams>
) => {
  return useQuery({
    queryKey: queryKeysTriggers.allTriggers(params),
    queryFn: () => fetchTriggers(params),
  });
};

export const useEditTrigger = () => {
  const refetchTriggers = useRefetchTriggersData();
  return useCustomMutation(
    editTrigger,
    {
      entity: MutationEntity.TRIGGER,
      action: MutationAction.EDIT,
    },
    {
      onSuccess: () => {
        refetchTriggers().then(() => socketConn.emit("refreshTriggers"));
      },
    }
  );
};

export const useCreateTrigger = () => {
  const refetchTriggers = useRefetchTriggersData();
  return useCustomMutation(
    createTrigger,
    {
      entity: MutationEntity.TRIGGER,
      action: MutationAction.CREATE,
    },
    {
      onSuccess: () => {
        refetchTriggers().then(() => socketConn.emit("refreshTriggers"));
      },
    }
  );
};

export const useDeleteTrigger = () => {
  const refetchTriggers = useRefetchTriggersData();
  return useCustomMutation(
    deleteTrigger,
    {
      entity: MutationEntity.TRIGGER,
      action: MutationAction.DELETE,
    },
    {
      onSuccess: () => {
        refetchTriggers().then(() => socketConn.emit("refreshTriggers"));
      },
    }
  );
};

export const useRefetchTriggersData = (exact = false) => {
  const queryClient = useQueryClient();
  return refetchDataFunctionHelper(
    queryKeysTriggers,
    "allTriggers",
    queryClient,
    [],
    exact
  );
};
