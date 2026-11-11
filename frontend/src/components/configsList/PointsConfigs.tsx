import { useAppDispatch, useAppSelector } from "@redux";
import ConfigInput from "./ConfigInput";
import { setPointsConfigs } from "@redux/configsSlice";

export default function PointsConfigsWrapper() {
  const dispatch = useAppDispatch();
  const {
    isUpdateMode,
    config: { pointsConfigs },
  } = useAppSelector((state) => state.configs);

  return (
    <>
      <div className="configs-section-inner-header">Points increment</div>

      <ConfigInput
        optionName="Message"
        setState={(e) =>
          dispatch(
            setPointsConfigs([
              "pointsIncrement",
              {
                ...pointsConfigs.pointsIncrement,
                message: e.currentTarget.valueAsNumber,
              },
            ]),
          )
        }
        value={pointsConfigs.pointsIncrement.message}
        showEdit={isUpdateMode}
      />
      <ConfigInput
        optionName="Watch"
        setState={(e) =>
          dispatch(
            setPointsConfigs([
              "pointsIncrement",
              {
                ...pointsConfigs.pointsIncrement,
                watch: e.currentTarget.valueAsNumber,
              },
            ]),
          )
        }
        value={pointsConfigs.pointsIncrement.watch}
        showEdit={isUpdateMode}
      />
      <ConfigInput
        optionName="Watch multipler"
        setState={(e) =>
          dispatch(
            setPointsConfigs([
              "pointsIncrement",
              {
                ...pointsConfigs.pointsIncrement,
                watchMultipler: e.currentTarget.valueAsNumber,
              },
            ]),
          )
        }
        value={pointsConfigs.pointsIncrement.watchMultipler}
        showEdit={isUpdateMode}
      />
    </>
  );
}
