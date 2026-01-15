import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BaseEndpointNames,
  customAxios,
  PromiseBackendData,
  PromisePaginationData,
  QueryParams,
  refetchDataFunctionHelper,
} from "../api";
import { FetchTagParams, Tag, TagCreateData, TagUpdateData } from "./types";
import { socketConn } from "@socket";
import { MutationAction, MutationEntity, useCustomMutation } from "@hooks";

export const fetchTagsDefaultParams: Required<FetchTagParams> = {
  limit: 10,
  page: 1,
  search_name: "",
  sortOrder: "asc",
  sortBy: "createdAt",
};

const baseEndpointName = BaseEndpointNames.TAGS;
export const queryKeysTags = {
  allTags: (params?: QueryParams<keyof FetchTagParams>) => [
    "tags",
    ...(params ? Object.entries(params).join(",") : []),
  ],
};

export const fetchTags = async (
  params?: QueryParams<keyof FetchTagParams>
): PromisePaginationData<Tag> => {
  const response = await customAxios.get(`/${baseEndpointName}`, { params });
  return response.data;
};

export const createTag = async (
  newTag: TagCreateData
): PromiseBackendData<Tag> => {
  const response = await customAxios.post(
    `/${baseEndpointName}/create`,
    newTag
  );
  return response.data;
};

export const editTag = async ({
  id,
  updatedTag,
}: {
  id: string;
  updatedTag: TagUpdateData;
}): PromiseBackendData<Tag> => {
  const response = await customAxios.patch(
    `/${baseEndpointName}/${id}`,
    updatedTag
  );
  return response.data;
};

export const deleteTag = async (id: string): PromiseBackendData<Tag> => {
  const response = await customAxios.delete(
    `/${baseEndpointName}/delete/${id}`
  );
  return response.data;
};

export const useGetTags = (params?: QueryParams<keyof FetchTagParams>) => {
  return useQuery({
    queryKey: queryKeysTags.allTags(params),
    queryFn: () => fetchTags(params),
  });
};

export const useEditTag = () => {
  const refetchTags = useRefetchTagsData();
  return useCustomMutation(
    editTag,
    {
      entity: MutationEntity.TAG,
      action: MutationAction.EDIT,
    },
    {
      onSuccess: () => refetchTags().then(() => socketConn.emit("changeModes")),
    }
  );
};

export const useCreateTag = () => {
  const refetchTags = useRefetchTagsData();
  return useCustomMutation(
    createTag,
    {
      entity: MutationEntity.TAG,
      action: MutationAction.CREATE,
    },
    {
      onSuccess: () => refetchTags().then(() => socketConn.emit("changeModes")),
    }
  );
};

export const useDeleteTag = () => {
  const refetchTags = useRefetchTagsData();
  return useCustomMutation(
    deleteTag,
    {
      entity: MutationEntity.TAG,
      action: MutationAction.DELETE,
    },
    {
      onSuccess: () => refetchTags().then(() => socketConn.emit("changeModes")),
    }
  );
};

export const useRefetchTagsData = (exact = false) => {
  const queryClient = useQueryClient();
  return refetchDataFunctionHelper(
    queryKeysTags,
    "allTags",
    queryClient,
    [],
    exact
  );
};
