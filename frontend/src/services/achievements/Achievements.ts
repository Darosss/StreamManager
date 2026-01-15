import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BaseEndpointNames,
  customAxios,
  PromiseBackendData,
  PromisePaginationData,
  QueryParams,
  refetchDataFunctionHelper,
} from "../api";
import {
  Achievement,
  AchievementUpdateData,
  AchievementUserProgress,
  CustomAchievementCreateData,
  CustomAchievementUpdateData,
  FetchAchievementsParams,
} from "./types";
import { MutationAction, MutationEntity, useCustomMutation } from "@hooks";

const baseEndpointName = BaseEndpointNames.ACHIEVEMENTS;

export const fetchAchievementsDefaultParams: Required<FetchAchievementsParams> =
  {
    limit: 10,
    page: 1,
    search_name: "",
    sortOrder: "asc",
    sortBy: "createdAt",
    custom_action: "",
  };

export const queryKeysAchievements = {
  allAchievements: (params?: QueryParams<keyof FetchAchievementsParams>) => [
    "achievements",
    ...(params ? Object.entries(params).join(",") : []),
  ],
  userAchievementsProgresses: (userId: string) =>
    ["user-achievements-progresses", userId] as [string, string],
};

export const fetchAchievements = async (
  params?: QueryParams<keyof FetchAchievementsParams>
): PromisePaginationData<Achievement> => {
  const response = await customAxios.get(`/${baseEndpointName}/`, {
    params,
  });
  return response.data;
};

export const createCustomAchievement = async (
  newAchievement: CustomAchievementCreateData
): PromiseBackendData<Achievement> => {
  const response = await customAxios.post(
    `/${baseEndpointName}/custom/create`,
    newAchievement
  );
  return response.data;
};

export const editAchievement = async ({
  id,
  updatedAchievement,
}: {
  id: string;
  updatedAchievement: AchievementUpdateData;
}): PromiseBackendData<Achievement> => {
  const response = await customAxios.patch(
    `/${baseEndpointName}/${id}`,
    updatedAchievement
  );
  return response.data;
};

export const editCustomAchievement = async ({
  id,
  updatedAchievement,
}: {
  id: string;
  updatedAchievement: CustomAchievementUpdateData;
}): PromiseBackendData<Achievement> => {
  const response = await customAxios.patch(
    `/${baseEndpointName}/custom/${id}`,
    updatedAchievement
  );
  return response.data;
};
export const deleteCustomAchievement = async (
  id: string
): PromiseBackendData<Achievement> => {
  const response = await customAxios.delete(
    `/${baseEndpointName}/custom/${id}`
  );
  return response.data;
};

export const useGetAchievements = (
  params?: QueryParams<keyof FetchAchievementsParams>
) => {
  return useQuery({
    queryKey: queryKeysAchievements.allAchievements(params),
    queryFn: () => fetchAchievements(params),
  });
};

export const useEditAchievement = () => {
  const refetchAchievements = useRefetchAchievementsData();
  return useCustomMutation(
    editAchievement,
    {
      entity: MutationEntity.ACHIEVEMENT,
      action: MutationAction.EDIT,
    },
    { onSuccess: refetchAchievements }
  );
};

export const useCreateCustomAchievement = () => {
  const refetchAchievements = useRefetchAchievementsData();

  return useCustomMutation(
    createCustomAchievement,
    {
      entity: MutationEntity.ACHIEVEMENT,
      action: MutationAction.CREATE,
    },
    {
      onSuccess: refetchAchievements,
    }
  );
};

export const useDeleteCustomAchievement = () => {
  const refetchAchievements = useRefetchAchievementsData();
  return useCustomMutation(
    deleteCustomAchievement,
    {
      entity: MutationEntity.ACHIEVEMENT,
      action: MutationAction.DELETE,
    },
    { onSuccess: refetchAchievements }
  );
};

export const useUpdateCustomAchievement = () => {
  const refetchAchievements = useRefetchAchievementsData();

  return useCustomMutation(
    editCustomAchievement,
    {
      entity: MutationEntity.ACHIEVEMENT,
      action: MutationAction.EDIT,
    },
    { onSuccess: refetchAchievements }
  );
};

/* PROGRESSES */
export const fetchProgresses = async (
  userId: string
): PromiseBackendData<AchievementUserProgress[]> => {
  const response = await customAxios.get(`/${baseEndpointName}/user/${userId}`);
  return response.data;
};

export const useGetUserAchievementsProgresses = (userId: string) => {
  return useQuery({
    queryKey: queryKeysAchievements.userAchievementsProgresses(userId),
    queryFn: () => fetchProgresses(userId),
  });
};

export const useRefetchAchievementsData = (exact = false) => {
  const queryClient = useQueryClient();
  return refetchDataFunctionHelper(
    queryKeysAchievements,
    "allAchievements",
    queryClient,
    [],
    exact
  );
};
