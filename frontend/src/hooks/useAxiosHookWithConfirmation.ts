import { NOTIFICATION_TYPE, useNotifications } from "@contexts";
import { useState, useEffect } from "react";

type DefaultHookType<TParams> = (params: TParams | null) => any;

interface UseAxiosWithConfirmationParams<TParams> {
  hookToProceed: DefaultHookType<TParams>;
  opts?: UseAxiosWithConfirmation;
}

interface UseAxiosWithConfirmation {
  showConfirmation?: boolean;
  successMessage?: string;
  confirmMessage?: string;
  onFullfiled?: () => void;
  onRejected?: () => void;
}

export const useAxiosWithConfirmation = <TParams>({
  hookToProceed,
  opts: {
    showConfirmation = true,
    successMessage = "Successfully done",
    confirmMessage = "Are you sure to proceed?",
    onFullfiled,
    onRejected,
  } = {},
}: UseAxiosWithConfirmationParams<TParams>) => {
  const { addNotify } = useNotifications();
  const [id, setId] = useState<TParams | null>(null);

  const { refetchData } = hookToProceed(id);

  const resetId = () => setId(null);

  useEffect(() => {
    if (!id) return;

    if (showConfirmation && !window.confirm(confirmMessage)) {
      resetId();
      return;
    }
    refetchData().then(
      () => {
        onFullfiled?.();
        addNotify({ title: successMessage, type: NOTIFICATION_TYPE.SUCCESS });
        resetId();
      },
      () => {
        onRejected?.();
        resetId();
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return setId;
};
