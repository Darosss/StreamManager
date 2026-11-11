import { useResetConfigs, useEditConfig, useGetConfigs } from "@services";
import { Loading } from "@components/axiosHelper";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@redux";
import {
  setConfigState,
  closeEditMode,
  openEditMode,
} from "@redux/configsSlice";

import Error from "@components/axiosHelper/errors";
import { Button } from "@components/ui/button";

export default function EditConfigs() {
  const dispatch = useAppDispatch();
  const { isUpdateMode, config: configsState } = useAppSelector(
    (state) => state.configs,
  );
  const { data: configs, isLoading, error } = useGetConfigs();

  const resetConfigsMutation = useResetConfigs();
  const editConfigsMutation = useEditConfig();

  useEffect(() => {
    if (!configs) return;
    dispatch(setConfigState(configs.data));
  }, [configs, dispatch]);

  if (error) return <Error error={error} />;
  if (isLoading || !configs) return <Loading />;

  const handleUpdateConfigs = () => {
    editConfigsMutation.mutate({ updatedConfig: configsState });
    dispatch(closeEditMode());
  };

  const handleResetConfigs = () => {
    if (!window.confirm("Are you sure you want reset configs to defaults?"))
      return;
    resetConfigsMutation.mutate({});
    dispatch(closeEditMode());
  };

  return (
    <div className="edit-configs-wrapper">
      <Button
        onClick={() => {
          dispatch(isUpdateMode ? closeEditMode() : openEditMode());
        }}
      >
        Edit
      </Button>
      {isUpdateMode ? (
        <>
          <Button variant="danger" onClick={handleUpdateConfigs}>
            Save
          </Button>
          <Button variant="danger" onClick={handleResetConfigs}>
            Reset to defaults
          </Button>
        </>
      ) : null}
    </div>
  );
}
