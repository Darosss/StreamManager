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
  FetchBadgesParams,
  Badge,
  GetBagesImagesResponseData,
  BadgeUpdateData,
  BadgeCreateData,
} from "./types";
import { MutationAction, MutationEntity, useCustomMutation } from "@hooks";

const baseEndpointName = `${BaseEndpointNames.ACHIEVEMENTS}/${BaseEndpointNames.BADGES}`;

export const queryKeysBadges = {
  allBadges: (params?: QueryParams<keyof FetchBadgesParams>) => [
    "badges",
    ...(params ? Object.entries(params).join(",") : []),
  ],
  badgesImages: ["badges-images"],
  badgesImagesBasePath: ["badges-images-base-path"],
};

export const uploadBadgesData = {
  badgesImages: "achievements/badges/images/upload",
};

export const fetchBadges = async (
  params?: QueryParams<keyof FetchBadgesParams>
): PromisePaginationData<Badge> => {
  const response = await customAxios.get(`/${baseEndpointName}/`, { params });
  return response.data;
};

export const fetchBadgesImages =
  async (): PromiseBackendData<GetBagesImagesResponseData> => {
    const response = await customAxios.get(
      `/${baseEndpointName}/available-images`
    );
    return response.data;
  };

export const fetchBadgesImagesBasePath =
  async (): PromiseBackendData<string> => {
    const response = await customAxios.get(
      `/${baseEndpointName}/available-images/base-path`
    );
    return response.data;
  };

export const editBadge = async ({
  id,
  updatedBadge,
}: {
  id: string;
  updatedBadge: BadgeUpdateData;
}): PromiseBackendData<Badge> => {
  const response = await customAxios.patch(
    `/${baseEndpointName}/${id}`,
    updatedBadge
  );
  return response.data;
};
export const createBadge = async ({
  newBadge,
}: {
  newBadge: BadgeCreateData;
}): PromiseBackendData<Badge> => {
  const response = await customAxios.post(
    `/${baseEndpointName}/create`,
    newBadge
  );
  return response.data;
};
export const deleteBadge = async (id: string): PromiseBackendData<Badge> => {
  const response = await customAxios.delete(
    `/${baseEndpointName}/delete/${id}`
  );
  return response.data;
};
export const deleteBadgeImage = async (
  name: string
): PromiseBackendData<boolean> => {
  const response = await customAxios.delete(
    `${baseEndpointName}/images/${name}/delete`
  );
  return response.data;
};

export const useGetBadges = (params?: FetchBadgesParams) => {
  return useQuery({
    queryKey: queryKeysBadges.allBadges(params),
    queryFn: () => fetchBadges(params),
  });
};

export const useGetBadgesImages = () => {
  return useQuery({
    queryKey: queryKeysBadges.badgesImages,
    queryFn: fetchBadgesImages,
  });
};
export const useGetBadgesIamgesBasePath = () => {
  return useQuery({
    queryKey: queryKeysBadges.badgesImagesBasePath,
    queryFn: fetchBadgesImagesBasePath,
  });
};

export const useEditBadge = () => {
  const refetchBadges = useRefetchBadgeData();
  return useCustomMutation(
    editBadge,
    {
      entity: MutationEntity.BADGE,
      action: MutationAction.EDIT,
    },
    { onSuccess: refetchBadges }
  );
};
export const useCreateBadge = () => {
  const refetchBadges = useRefetchBadgeData();
  return useCustomMutation(
    createBadge,
    {
      entity: MutationEntity.BADGE,
      action: MutationAction.CREATE,
    },
    { onSuccess: refetchBadges }
  );
};
export const useDeleteBadge = () => {
  const refetchBadges = useRefetchBadgeData();
  return useCustomMutation(
    deleteBadge,
    {
      entity: MutationEntity.BADGE,
      action: MutationAction.DELETE,
    },
    { onSuccess: refetchBadges }
  );
};
export const useDeleteBadgeImage = () => {
  const refetchBadges = useRefetchBadgeData();
  return useCustomMutation(
    deleteBadgeImage,
    {
      entity: MutationEntity.BADGE_IMAGE,
      action: MutationAction.DELETE,
    },
    { onSuccess: refetchBadges }
  );
};

export const useRefetchBadgeData = (exact = false) => {
  const queryClient = useQueryClient();
  return refetchDataFunctionHelper(
    queryKeysBadges,
    "allBadges",
    queryClient,
    [],
    exact
  );
};
