import {
  NOTIFICATION_TYPE,
  NotificationOpts,
  useNotifications,
} from "@contexts";
import { AxiosError } from "axios";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

export enum MutationAction {
  EDIT = "Edited",
  CREATE = "Created",
  DELETE = "Deleted",
  DUPLICATE = "Duplicated",
  INCREMENT_USES = "Incremented uses",
  REVERT = "Reverted",
}
export enum MutationEntity {
  ACHIEVEMENT = "achievement",
  ACHIEVEMENT_STAGE = "achievement stage",
  ACHIEVEMENT_STAGE_SOUND = "achievement stage sound",
  ALERT_SOUND = "alert sound",
  BADGE = "achievement badge",
  BADGE_IMAGE = "achievement badge image",
  SONG = "song",
  AFFIX = "affix",
  COMMAND = "command",
  CONFIG = "config",
  FILE = "file",
  FOLDER = "folder",
  MESSAGE_CATEGORY = "message category",
  MOOD = "mood",
  OVERLAY = "overlay",
  STREAM_SESSION = "stream session",
  TAG = "tag",
  TIMER = "timer",
  TRIGGER = "trigger",
  USER = "user",
  WIDGET = "widget",
}

type MutationMeta = {
  entity: MutationEntity;
  action: MutationAction;
};

export function useCustomMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  meta: MutationMeta,
  options?: UseMutationOptions<TData, unknown, TVariables>
) {
  const { addNotify } = useNotifications();
  const { onSuccess, onError, ...restOptions } = options || {};
  return useMutation<TData, unknown, TVariables>({
    mutationFn,
    onSuccess: (data, variables, onMutateResult, context) => {
      const notification = getNotificationSuccessData(meta);

      addNotify(notification);

      options?.onSuccess?.(data, variables, onMutateResult, context);
    },

    onError: (error, variables, onMutateResult, context) => {
      const notification = getNotificationErrorData(error, meta);
      addNotify(notification);

      options?.onError?.(error, variables, onMutateResult, context);
    },

    ...restOptions,
  });
}

export const getNotificationSuccessData = (
  { entity, action }: MutationMeta,
  customDuration = 8000
): NotificationOpts => {
  return {
    title: `${entity} successfully ${action.toLowerCase()}`,
    duration: customDuration,
    type: NOTIFICATION_TYPE.SUCCESS,
  };
};

export const getNotificationErrorData = (
  error: unknown,
  { entity, action }: MutationMeta,
  customDuration = 8000
): NotificationOpts => {
  const errorData = { message: "", status: 0 };

  if (error && error instanceof AxiosError && error.response?.data) {
    errorData.message = error.response.data.message;
    errorData.status = error.response.data.status || 400;
  } else if (error instanceof Error) {
    errorData.message = error.message;
    errorData.status = 500;
  }
  return {
    title: `${entity} couldn't be ${action.toLowerCase()}`,
    message: errorData.message
      ? `${errorData.status}: ${errorData.message}`
      : ` ${entity} couldn't be ${action}`,
    duration: customDuration,
    type: NOTIFICATION_TYPE.DANGER,
  };
};
