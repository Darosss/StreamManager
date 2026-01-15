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
  FetchChatCommandParams,
  ChatCommand,
  ChatCommandCreateData,
  ChatCommandUpdateData,
} from "./types";
import { socketConn } from "@socket";
import { MutationAction, MutationEntity, useCustomMutation } from "@hooks";

const baseEndpointName = BaseEndpointNames.CHAT_COMMANDS;

export const queryKeysChatCommands = {
  allChatCommands: (params?: QueryParams<keyof FetchChatCommandParams>) => [
    "chat-commands",
    ...(params ? Object.entries(params).join(",") : []),
  ],
};

export const fetchChatCommandsDefaultParams: Required<FetchChatCommandParams> =
  {
    limit: 10,
    page: 1,
    search_name: "",
    sortOrder: "asc",
    sortBy: "createdAt",
    end_date: "",
    start_date: "",
    privilege: "",
    aliases: "",
    description: "",
    messages: "",
  };

export const fetchChatCommands = async (
  params?: QueryParams<keyof FetchChatCommandParams>
): PromisePaginationData<ChatCommand> => {
  const response = await customAxios.get(`/${baseEndpointName}`, {
    params,
  });
  return response.data;
};

export const createChatCommand = async (
  newChatCommand: ChatCommandCreateData
): PromiseBackendData<ChatCommand> => {
  const response = await customAxios.post(
    `/${baseEndpointName}/create`,
    newChatCommand
  );
  return response.data;
};

export const editChatCommand = async ({
  id,
  updatedChatCommand,
}: {
  id: string;
  updatedChatCommand: ChatCommandUpdateData;
}): PromiseBackendData<ChatCommand> => {
  const response = await customAxios.patch(
    `/${baseEndpointName}/${id}`,
    updatedChatCommand
  );
  return response.data;
};

export const deleteChatCommand = async (
  id: string
): PromiseBackendData<ChatCommand> => {
  const response = await customAxios.delete(
    `/${baseEndpointName}/delete/${id}`
  );
  return response.data;
};

export const useGetChatCommands = (
  params?: QueryParams<keyof FetchChatCommandParams>
) => {
  return useQuery({
    queryKey: queryKeysChatCommands.allChatCommands(params),
    queryFn: () => fetchChatCommands(params),
  });
};

export const useEditChatCommand = () => {
  const refetchChatCommands = useRefetchChatCommandsData();
  return useCustomMutation(
    editChatCommand,
    { entity: MutationEntity.COMMAND, action: MutationAction.EDIT },
    {
      onSuccess: () => {
        refetchChatCommands().then(() => socketConn.emit("refreshCommands"));
      },
    }
  );
};

export const useCreateChatCommand = () => {
  const refetchChatCommands = useRefetchChatCommandsData();
  return useCustomMutation(
    createChatCommand,
    {
      entity: MutationEntity.COMMAND,
      action: MutationAction.CREATE,
    },
    {
      onSuccess: () => {
        refetchChatCommands().then(() => socketConn.emit("refreshCommands"));
      },
    }
  );
};

export const useDeleteChatCommand = () => {
  const refetchChatCommands = useRefetchChatCommandsData();
  return useCustomMutation(
    deleteChatCommand,
    { entity: MutationEntity.COMMAND, action: MutationAction.DELETE },
    {
      onSuccess: () => {
        refetchChatCommands().then(() => socketConn.emit("refreshCommands"));
      },
    }
  );
};

export const useRefetchChatCommandsData = (exact = false) => {
  const queryClient = useQueryClient();
  return refetchDataFunctionHelper(
    queryKeysChatCommands,
    "allChatCommands",
    queryClient,
    [],
    exact
  );
};
