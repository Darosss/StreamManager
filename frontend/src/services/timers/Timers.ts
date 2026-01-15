import { useQuery, useQueryClient } from "react-query";
import {
  BaseEndpointNames,
  customAxios,
  PromiseBackendData,
  PromisePaginationData,
  QueryParams,
  refetchDataFunctionHelper,
} from "../api";
import {
  FetchTimerParams,
  Timer,
  TimerCreateData,
  TimerUpdateData,
} from "./types";
import { socketConn } from "@socket";
import { MutationAction, MutationEntity, useCustomMutation } from "@hooks";

export const fetchTimersDefaultParams: Required<FetchTimerParams> = {
  limit: 10,
  page: 1,
  search_name: "",
  sortOrder: "desc",
  sortBy: "createdAt",
  messages: "",
};

const baseEndpointName = BaseEndpointNames.TIMERS;
export const queryKeysTimers = {
  allTimers: "timers",
};

export const fetchTimers = async (
  params?: QueryParams<keyof FetchTimerParams>
): PromisePaginationData<Timer> => {
  const response = await customAxios.get(`/${baseEndpointName}`, { params });
  return response.data;
};

export const createTimer = async (
  newTimer: TimerCreateData
): PromiseBackendData<Timer> => {
  const response = await customAxios.post(
    `/${baseEndpointName}/create`,
    newTimer
  );
  return response.data;
};

export const editTimer = async ({
  id,
  updatedTimer,
}: {
  id: string;
  updatedTimer: TimerUpdateData;
}): PromiseBackendData<Timer> => {
  const response = await customAxios.patch(
    `/${baseEndpointName}/${id}`,
    updatedTimer
  );
  return response.data;
};

export const deleteTimer = async (id: string): PromiseBackendData<Timer> => {
  const response = await customAxios.delete(
    `/${baseEndpointName}/delete/${id}`
  );
  return response.data;
};

export const useGetTimers = (params?: QueryParams<keyof FetchTimerParams>) => {
  return useQuery([queryKeysTimers.allTimers, params], () =>
    fetchTimers(params)
  );
};

export const useEditTimer = () => {
  const refetchTimers = useRefetchTimersData();
  return useCustomMutation(
    editTimer,
    {
      entity: MutationEntity.TIMER,
      action: MutationAction.EDIT,
    },
    {
      onSuccess: () =>
        refetchTimers().then(() => socketConn.emit("refreshTimers")),
    }
  );
};

export const useCreateTimer = () => {
  const refetchTimers = useRefetchTimersData();
  return useCustomMutation(
    createTimer,
    {
      entity: MutationEntity.TIMER,
      action: MutationAction.CREATE,
    },
    {
      onSuccess: () =>
        refetchTimers().then(() => socketConn.emit("refreshTimers")),
    }
  );
};

export const useDeleteTimer = () => {
  const refetchTimers = useRefetchTimersData();
  return useCustomMutation(
    deleteTimer,
    {
      entity: MutationEntity.TIMER,
      action: MutationAction.DELETE,
    },
    {
      onSuccess: () => {
        refetchTimers().then(() => socketConn.emit("refreshTimers"));
      },
    }
  );
};
export const useRefetchTimersData = (exact = false) => {
  const queryClient = useQueryClient();
  return refetchDataFunctionHelper(
    queryKeysTimers,
    "allTimers",
    queryClient,
    null,
    exact
  );
};
