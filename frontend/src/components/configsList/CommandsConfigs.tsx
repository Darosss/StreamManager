import { setCommandsConfigs } from "@redux/configsSlice";
import ConfigInput from "./ConfigInput";
import { useAppDispatch, useAppSelector } from "@redux";

export default function CommandsConfigsWrapper() {
  const dispatch = useAppDispatch();
  const {
    isUpdateMode,
    config: { commandsConfigs },
  } = useAppSelector((state) => state.configs);

  return (
    <>
      <ConfigInput
        optionName="Commands prefix"
        setState={(e) =>
          dispatch(
            setCommandsConfigs(["commandsPrefix", e.currentTarget.value]),
          )
        }
        value={commandsConfigs.commandsPrefix}
        showEdit={isUpdateMode}
        inputType="text"
      />
    </>
  );
}
