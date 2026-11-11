import ConfigInput from "./ConfigInput";
import ConfigButton from "./ConfigButton";
import { useAppDispatch, useAppSelector } from "@redux";

import { setMusicConfigs } from "@redux/configsSlice";

export default function MusicConfigsWrapper() {
  const dispatch = useAppDispatch();
  const {
    isUpdateMode,
    config: { musicConfigs },
  } = useAppSelector((state) => state.configs);

  return (
    <>
      <ConfigButton
        optionName="Song request"
        setState={() =>
          dispatch(setMusicConfigs(["songRequest", !musicConfigs.songRequest]))
        }
        value={musicConfigs.songRequest}
        showEdit={isUpdateMode}
      />
      <ConfigInput
        optionName="Max auto que size"
        setState={(e) =>
          dispatch(
            setMusicConfigs(["maxAutoQueSize", e.currentTarget.valueAsNumber]),
          )
        }
        value={musicConfigs.maxAutoQueSize}
        showEdit={isUpdateMode}
      />
      <ConfigInput
        optionName="Max song request by user"
        setState={(e) =>
          dispatch(
            setMusicConfigs([
              "maxSongRequestByUser",
              e.currentTarget.valueAsNumber,
            ]),
          )
        }
        value={musicConfigs.maxSongRequestByUser}
        showEdit={isUpdateMode}
      />
    </>
  );
}
