import { useAppDispatch, useAppSelector } from "@redux";
import ConfigInput from "./ConfigInput";

import { setTriggersConfigs } from "@redux/configsSlice";

export default function TriggersConfigsWrapper() {
  const dispatch = useAppDispatch();
  const {
    isUpdateMode,
    config: { triggersConfigs },
  } = useAppSelector((state) => state.configs);

  return (
    <>
      <ConfigInput
        optionName="Random message chance"
        setState={(e) =>
          dispatch(
            setTriggersConfigs([
              "randomMessageChance",
              e.currentTarget.valueAsNumber,
            ]),
          )
        }
        value={triggersConfigs.randomMessageChance}
        showEdit={isUpdateMode}
      />
      <ConfigInput
        optionName="Prefix chances"
        setState={(e) =>
          dispatch(
            setTriggersConfigs(["prefixChance", e.currentTarget.valueAsNumber]),
          )
        }
        value={triggersConfigs.prefixChance}
        showEdit={isUpdateMode}
      />
      <ConfigInput
        optionName="Sufix chances"
        setState={(e) =>
          dispatch(
            setTriggersConfigs(["suffixChance", e.currentTarget.valueAsNumber]),
          )
        }
        value={triggersConfigs.suffixChance}
        showEdit={isUpdateMode}
      />
    </>
  );
}
