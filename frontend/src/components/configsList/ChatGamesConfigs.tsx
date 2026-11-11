import { setChatGamesConfigs } from "@redux/configsSlice";

import ConfigInput from "./ConfigInput";
import { useAppDispatch, useAppSelector } from "@redux";

export default function ChatGamesConfigsWrapper() {
  const dispatch = useAppDispatch();
  const {
    isUpdateMode,
    config: { chatGamesConfigs },
  } = useAppSelector((state) => state.configs);

  return (
    <>
      <ConfigInput
        optionName="Max time active user"
        setState={(e) =>
          dispatch(
            setChatGamesConfigs([
              "activeUserTimeDelay",
              e.currentTarget.valueAsNumber,
            ]),
          )
        }
        value={chatGamesConfigs.activeUserTimeDelay}
        showEdit={isUpdateMode}
      />
      <ConfigInput
        optionName="Chat games interval delay"
        setState={(e) =>
          dispatch(
            setChatGamesConfigs([
              "chatGamesIntervalDelay",
              e.currentTarget.valueAsNumber,
            ]),
          )
        }
        value={chatGamesConfigs.chatGamesIntervalDelay}
        showEdit={isUpdateMode}
      />
      <ConfigInput
        optionName="Minimum active users threshhold"
        setState={(e) =>
          dispatch(
            setChatGamesConfigs([
              "minActiveUsersThreshold",
              e.currentTarget.valueAsNumber,
            ]),
          )
        }
        value={chatGamesConfigs.minActiveUsersThreshold}
        showEdit={isUpdateMode}
      />
    </>
  );
}
