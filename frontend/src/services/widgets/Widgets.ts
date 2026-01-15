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
  FetchWidgetsParams,
  Widget,
  WidgetCreateData,
  WidgetUpdateData,
} from "./types";
import { MutationAction, MutationEntity, useCustomMutation } from "@hooks";

const baseEndpointName = BaseEndpointNames.WIDGETS;
export const queryKeysWidgets = {
  allWidgets: (params?: QueryParams<keyof FetchWidgetsParams>) => [
    "widgets",
    ...(params ? Object.entries(params).join(",") : []),
  ],
  widgetById: (id: string) => ["widgets", id] as [string, string],
};

export const fetchWidgetsDefaultParams: Required<FetchWidgetsParams> = {
  limit: 10,
  page: 1,
  search_name: "",
  sortOrder: "desc",
  sortBy: "createdAt",
};

export const fetchWidgets = async (
  params?: QueryParams<keyof FetchWidgetsParams>
): PromisePaginationData<Widget> => {
  const response = await customAxios.get(`/${baseEndpointName}`, { params });
  return response.data;
};

export const fetchWidgetById = async (
  id: string
): PromiseBackendData<Widget> => {
  const response = await customAxios.get(`/${baseEndpointName}/${id}`);
  return response.data;
};

export const createWidget = async (
  newWidgets: WidgetCreateData
): PromiseBackendData<Widget> => {
  const response = await customAxios.post(
    `/${baseEndpointName}/create`,
    newWidgets
  );
  return response.data;
};

export const editWidget = async ({
  id,
  updatedWidget,
}: {
  id: string;
  updatedWidget: WidgetUpdateData;
}): PromiseBackendData<Widget> => {
  const response = await customAxios.patch(
    `/${baseEndpointName}/${id}`,
    updatedWidget
  );
  return response.data;
};

export const deleteWidget = async (id: string): PromiseBackendData<Widget> => {
  const response = await customAxios.delete(
    `/${baseEndpointName}/delete/${id}`
  );
  return response.data;
};

export const useGetWidgets = (
  params?: QueryParams<keyof FetchWidgetsParams>
) => {
  return useQuery({
    queryKey: queryKeysWidgets.allWidgets(params),
    queryFn: () => fetchWidgets(params),
  });
};

export const useEditWidget = () => {
  const refetchWidgets = useRefetchWidgetsData();
  return useCustomMutation(
    editWidget,
    {
      entity: MutationEntity.WIDGET,
      action: MutationAction.EDIT,
    },
    { onSuccess: refetchWidgets }
  );
};

export const useCreateWidget = () => {
  const refetchWidgets = useRefetchWidgetsData();
  return useCustomMutation(
    createWidget,
    {
      entity: MutationEntity.WIDGET,
      action: MutationAction.CREATE,
    },
    { onSuccess: refetchWidgets }
  );
};

export const useDeleteWidget = () => {
  const refetchWidgets = useRefetchWidgetsData();
  return useCustomMutation(
    deleteWidget,
    {
      entity: MutationEntity.WIDGET,
      action: MutationAction.DELETE,
    },
    { onSuccess: refetchWidgets }
  );
};

export const useGetWidgetById = (id: string) => {
  return useQuery({
    queryKey: queryKeysWidgets.widgetById(id),
    queryFn: () => fetchWidgetById(id),
  });
};

export const useRefetchWidgetsData = (exact = false) => {
  const queryClient = useQueryClient();
  return refetchDataFunctionHelper(
    queryKeysWidgets,
    "allWidgets",
    queryClient,
    [],
    exact
  );
};
