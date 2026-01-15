import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BackendData,
  BaseEndpointNames,
  customAxios,
  PromiseBackendData,
  refetchDataFunctionHelper,
} from "../api";
import { socketConn } from "@socket";
import { Config, ConfigUpdateData } from "./types";
import { MutationAction, MutationEntity, useCustomMutation } from "@hooks";

const baseEndpointName = BaseEndpointNames.CONFIGS;

export const queryKeysConfigs = {
  allConfigs: ["configs"],
};

export const fetchConfigs = async (): Promise<BackendData<Config>> => {
  const response = await customAxios.get(`/${baseEndpointName}`);
  return response.data;
};

export const editConfig = async ({
  updatedConfig,
}: {
  updatedConfig: ConfigUpdateData;
}): PromiseBackendData<Config> => {
  const response = await customAxios.patch(
    `/${baseEndpointName}/edit`,
    updatedConfig
  );
  return response.data;
};

export const resetConfigs = async (): PromiseBackendData<Config> => {
  const response = await customAxios.patch(`/${baseEndpointName}/defaults`);
  return response.data;
};

export const useGetConfigs = () => {
  return useQuery({
    queryKey: queryKeysConfigs.allConfigs,
    queryFn: () => fetchConfigs(),
  });
};

export const useEditConfig = () => {
  const refetchConfigs = useRefetchConfigsData();
  return useCustomMutation(
    editConfig,
    {
      entity: MutationEntity.CONFIG,
      action: MutationAction.EDIT,
    },
    {
      onSuccess: () => {
        refetchConfigs().then(() => socketConn.emit("saveConfigs"));
      },
    }
  );
};

export const useResetConfigs = () => {
  const refetchConfigs = useRefetchConfigsData();
  return useCustomMutation(
    resetConfigs,
    {
      entity: MutationEntity.CONFIG,
      action: MutationAction.REVERT,
    },
    {
      onSuccess: () => {
        refetchConfigs().then(() => socketConn.emit("saveConfigs"));
      },
    }
  );
};

export const useRefetchConfigsData = (exact = false) => {
  const queryClient = useQueryClient();
  return refetchDataFunctionHelper(
    queryKeysConfigs,
    "allConfigs",
    queryClient,
    null,
    exact
  );
};
