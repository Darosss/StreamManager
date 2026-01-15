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
  FetchMessageCategoriesParams,
  MessageCategory,
  MessageCategoryCreateData,
  MessageCategoryUpdateData,
} from "./types";
import { MutationAction, MutationEntity, useCustomMutation } from "@hooks";

const baseEndpointName = BaseEndpointNames.MESSAGE_CATEGORIES;
export const queryKeysMessageCategories = {
  allMessageCategories: (
    params?: QueryParams<keyof FetchMessageCategoriesParams>
  ) => [
    "message-categories",
    ...(params ? Object.entries(params).join(",") : []),
  ],
};

export const fetchMessageCategoriesDefaultParams: Required<FetchMessageCategoriesParams> =
  {
    limit: 10,
    page: 1,
    search_name: "",
    sortOrder: "asc",
    sortBy: "createdAt",
    messages: "",
  };

export const fetchMessageCategories = async (
  params?: QueryParams<keyof FetchMessageCategoriesParams>
): PromisePaginationData<MessageCategory> => {
  const response = await customAxios.get(`/${baseEndpointName}`, { params });
  return response.data;
};

export const createMessageCategory = async (
  newMessageCategory: MessageCategoryCreateData
): PromiseBackendData<MessageCategory> => {
  const response = await customAxios.post(
    `/${baseEndpointName}/create`,
    newMessageCategory
  );
  return response.data;
};
export const incrementUsesMessageCategory = async (
  id: string
): PromiseBackendData<MessageCategory> => {
  const response = await customAxios.patch(`/${baseEndpointName}/${id}/uses`);
  return response.data;
};

export const editMessageCategory = async ({
  id,
  updatedMessageCategory,
}: {
  id: string;
  updatedMessageCategory: MessageCategoryUpdateData;
}): PromiseBackendData<MessageCategory> => {
  const response = await customAxios.patch(
    `/${baseEndpointName}/${id}`,
    updatedMessageCategory
  );
  return response.data;
};

export const deleteMessageCategory = async (
  id: string
): PromiseBackendData<MessageCategory> => {
  const response = await customAxios.delete(
    `/${baseEndpointName}/delete/${id}`
  );
  return response.data;
};

export const useGetMessageCategories = (
  params?: QueryParams<keyof FetchMessageCategoriesParams>
) => {
  return useQuery({
    queryKey: queryKeysMessageCategories.allMessageCategories(params),
    queryFn: () => fetchMessageCategories(params),
  });
};

export const useEditMessageCategory = () => {
  const refetchMessageCategories = useRefetchMessageCategoriesData();
  return useCustomMutation(
    editMessageCategory,
    {
      entity: MutationEntity.MESSAGE_CATEGORY,
      action: MutationAction.EDIT,
    },
    {
      onSuccess: refetchMessageCategories,
    }
  );
};

export const useIncrementUsesCategoryById = () => {
  const refetchMessageCategories = useRefetchMessageCategoriesData();
  return useCustomMutation(
    incrementUsesMessageCategory,
    {
      entity: MutationEntity.MESSAGE_CATEGORY,
      action: MutationAction.INCREMENT_USES,
    },
    { onSuccess: refetchMessageCategories }
  );
};

export const useCreateMessageCategory = () => {
  const refetchMessageCategories = useRefetchMessageCategoriesData();
  return useCustomMutation(
    createMessageCategory,
    {
      entity: MutationEntity.MESSAGE_CATEGORY,
      action: MutationAction.CREATE,
    },
    { onSuccess: refetchMessageCategories }
  );
};

export const useDeleteMessageCategory = () => {
  const refetchMessageCategories = useRefetchMessageCategoriesData();
  return useCustomMutation(
    deleteMessageCategory,
    {
      entity: MutationEntity.MESSAGE_CATEGORY,
      action: MutationAction.DELETE,
    },
    { onSuccess: refetchMessageCategories }
  );
};

export const useRefetchMessageCategoriesData = (exact = false) => {
  const queryClient = useQueryClient();
  return refetchDataFunctionHelper(
    queryKeysMessageCategories,
    "allMessageCategories",
    queryClient,
    [],
    exact
  );
};
