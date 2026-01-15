import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BaseEndpointNames,
  QueryParams,
  PromisePaginationData,
  customAxios,
  PromiseBackendData,
  refetchDataFunctionHelper,
} from "../api";
import { FetchMoodParams, Mood, MoodCreateData, MoodUpdateData } from "./types";
import { socketConn } from "@socket";
import { MutationAction, MutationEntity, useCustomMutation } from "@hooks";

export const fetchMoodsDefaultParams: Required<FetchMoodParams> = {
  limit: 10,
  page: 1,
  search_name: "",
  sortOrder: "asc",
  sortBy: "createdAt",
};

const baseEndpointName = BaseEndpointNames.MOODS;
export const queryKeysMoods = {
  allMoods: (params?: QueryParams<keyof FetchMoodParams>) => [
    "moods",
    ...(params ? Object.entries(params).join(",") : []),
  ],
};

export const fetchMoods = async (
  params?: QueryParams<keyof FetchMoodParams>
): PromisePaginationData<Mood> => {
  const response = await customAxios.get(`/${baseEndpointName}`, { params });
  return response.data;
};

export const createMood = async (
  newMood: MoodCreateData
): PromiseBackendData<Mood> => {
  const response = await customAxios.post(
    `/${baseEndpointName}/create`,
    newMood
  );
  return response.data;
};

export const editMood = async ({
  id,
  updatedMood,
}: {
  id: string;
  updatedMood: MoodUpdateData;
}): PromiseBackendData<Mood> => {
  const response = await customAxios.patch(
    `/${baseEndpointName}/${id}`,
    updatedMood
  );
  return response.data;
};

export const deleteMood = async (id: string): PromiseBackendData<Mood> => {
  const response = await customAxios.delete(
    `/${baseEndpointName}/delete/${id}`
  );
  return response.data;
};

export const useGetMoods = (params?: QueryParams<keyof FetchMoodParams>) => {
  return useQuery({
    queryKey: queryKeysMoods.allMoods(params),
    queryFn: () => fetchMoods(params),
  });
};

export const useEditMood = () => {
  const refetchMoods = useRefetchMoodsData();
  return useCustomMutation(
    editMood,
    {
      entity: MutationEntity.MOOD,
      action: MutationAction.EDIT,
    },
    {
      onSuccess: () => {
        refetchMoods().then(() => socketConn.emit("changeModes"));
      },
    }
  );
};

export const useCreateMood = () => {
  const refetchMoods = useRefetchMoodsData();
  return useCustomMutation(
    createMood,
    {
      entity: MutationEntity.MOOD,
      action: MutationAction.CREATE,
    },
    {
      onSuccess: () => {
        refetchMoods().then(() => socketConn.emit("changeModes"));
      },
    }
  );
};

export const useDeleteMood = () => {
  const refetchMoods = useRefetchMoodsData();
  return useCustomMutation(
    deleteMood,
    {
      entity: MutationEntity.MOOD,
      action: MutationAction.DELETE,
    },
    {
      onSuccess: () => {
        refetchMoods().then(() => socketConn.emit("changeModes"));
      },
    }
  );
};

export const useRefetchMoodsData = (exact = false) => {
  const queryClient = useQueryClient();
  return refetchDataFunctionHelper(
    queryKeysMoods,
    "allMoods",
    queryClient,
    [],
    exact
  );
};
