import { DateTooltip } from "@components/dateTooltip";
import { useAppDispatch, useAppSelector } from "@redux";

import { setName } from "@redux/stagesSlice";

interface BaseDetailsAchievementStageProps {
  editing: boolean;
}
export default function BaseDetailsAchievementStage({
  editing,
}: BaseDetailsAchievementStageProps) {
  const dispatch = useAppDispatch();
  const { stage } = useAppSelector((state) => state.stages);

  return (
    <>
      <div>
        <div>Name</div>
        <div>
          {editing ? (
            <input
              type="text"
              value={stage.name}
              onChange={(e) => dispatch(setName(e.target.value))}
            />
          ) : (
            stage.name
          )}
        </div>
      </div>
      <div>
        <div>Created / updated</div>
        <div>
          <DateTooltip date={new Date(stage.createdAt)} />
        </div>
        <div>
          <DateTooltip date={new Date(stage.updatedAt)} />
        </div>
      </div>
    </>
  );
}
