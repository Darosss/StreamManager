import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BaseEndpointNames,
  PromiseBackendData,
  customAxios,
  refetchDataFunctionHelper,
} from "../api";
import { DeleteMp3FileParams } from "./types";
import { MutationAction, MutationEntity, useCustomMutation } from "@hooks";

const baseEndpointName = BaseEndpointNames.FILES;
export const queryKeysFiles = {
  allFoldersList: ["folders-list"],
  folderFilesAudio: (folderName: string) =>
    ["files-audio", folderName] as [string, string],
  alertsFilesAudio: [`alerts-mp3-names`],
};

//Note: this data is for backend multer
export const uploadMp3Data = {
  endpoint: (folderName: string) => `files/upload/audio-mp3/${folderName}`,
  uploadName: "uploaded_file",
  rewardsAlertSounds: "files/upload/alertSounds",
};

export const fetchFoldersList = async (): PromiseBackendData<string[]> => {
  const response = await customAxios.get(`/${baseEndpointName}/folder-list/`);
  return response.data;
};
export const fetchFoldersMp3FilesList = async (
  folderName: string
): PromiseBackendData<string[]> => {
  const response = await customAxios.get(
    `/${baseEndpointName}/audio/${folderName}`
  );
  return response.data;
};

export const deleteMp3File = async ({
  folderName,
  fileName,
}: DeleteMp3FileParams): PromiseBackendData<string> => {
  const response = await customAxios.delete(
    `/${baseEndpointName}/delete/audio/${folderName}/${fileName}`
  );
  return response.data;
};

export const createAudioFolder = async (
  folderName: string
): PromiseBackendData<unknown> => {
  const response = await customAxios.post(
    `/${baseEndpointName}/create/audio/${folderName}`
  );
  return response.data;
};

export const deleteAudioFolder = async (
  folderName: string
): PromiseBackendData<unknown> => {
  const response = await customAxios.delete(
    `/${baseEndpointName}/delete/folder/audio/${folderName}`
  );
  return response.data;
};

export const fetchAlertSoundsMp3Names = async (): PromiseBackendData<
  string[]
> => {
  const response = await customAxios.get(
    `/${baseEndpointName}/audio/alertSounds`
  );
  return response.data;
};
export const deleteAlertSound = async (
  fileName: string
): PromiseBackendData<unknown> => {
  const response = await customAxios.delete(
    `/${baseEndpointName}/delete/alertSounds/${fileName}`
  );
  return response.data;
};

export const useGetFoldersList = () => {
  return useQuery({
    queryKey: queryKeysFiles.allFoldersList,
    queryFn: fetchFoldersList,
  });
};

export const useGetFolderMp3Files = (folderName: string) => {
  return useQuery({
    queryKey: queryKeysFiles.folderFilesAudio(folderName),
    queryFn: () => fetchFoldersMp3FilesList(folderName),
  });
};

export const useDeleteMp3File = () => {
  const refetchFilesData = useRefetchFoldersFilesAudioData();
  return useCustomMutation(
    deleteMp3File,
    {
      entity: MutationEntity.FILE,
      action: MutationAction.DELETE,
    },
    {
      onSuccess: (_, variables) => {
        refetchFilesData(variables.folderName);
      },
    }
  );
};

export const useCreateAudioFolder = () => {
  const refetchFilesData = useRefetchAllFoldersListData();
  return useCustomMutation(
    createAudioFolder,
    {
      entity: MutationEntity.FOLDER,
      action: MutationAction.CREATE,
    },
    {
      onSuccess: refetchFilesData,
    }
  );
};

export const useDeleteAudioFolder = () => {
  const refetchFilesData = useRefetchAllFoldersListData();
  return useCustomMutation(
    deleteAudioFolder,
    {
      entity: MutationEntity.FOLDER,
      action: MutationAction.DELETE,
    },
    {
      onSuccess: refetchFilesData,
    }
  );
};

export const useGetAlertSoundsMp3Names = () => {
  return useQuery({
    queryKey: queryKeysFiles.alertsFilesAudio,
    queryFn: fetchAlertSoundsMp3Names,
  });
};

export const useDeleteAlertSound = () => {
  const refetchFilesData = useRefetchAllFoldersListData();
  return useCustomMutation(
    deleteAlertSound,
    {
      entity: MutationEntity.ALERT_SOUND,
      action: MutationAction.DELETE,
    },
    {
      onSuccess: refetchFilesData,
    }
  );
};

export const useRefetchAllFoldersListDat2a = (
  key: keyof typeof queryKeysFiles,
  exact = false
) => {
  const queryClient = useQueryClient();
  return refetchDataFunctionHelper(
    queryKeysFiles,
    "allFoldersList",
    queryClient,
    null,
    exact
  );
};

export const useRefetchAllFoldersListData = (exact = false) => {
  const queryClient = useQueryClient();
  return refetchDataFunctionHelper(
    queryKeysFiles,
    "allFoldersList",
    queryClient,
    null,
    exact
  );
};

export const useRefetchFoldersFilesAudioData = (exact = false) => {
  const queryClient = useQueryClient();
  return (folderName: string) =>
    refetchDataFunctionHelper(
      queryKeysFiles,
      "folderFilesAudio",
      queryClient,
      [folderName],
      exact
    );
};
