import { DateTooltip } from "@components/dateTooltip";
import { TableDataWrapper } from "@components/tableWrapper";
import { Achievement, useDeleteCustomAchievement } from "@services";
import { useDispatch } from "react-redux";
import {
  AchievementSliceType,
  ManageAchievementsCurrentAction,
  openModal,
  setAchievementState,
  setCurrentAction,
  setEditingId,
} from "@redux/achievementsSlice";
import { Button } from "@components/ui";
import { StatusLabel } from "@components/common/StatusLabel";

interface TBodyDataProps {
  data: Achievement[];
}

const getAchievementsStateDataHelper = (
  achievement: Achievement
): AchievementSliceType["achievement"] => {
  return {
    ...achievement,
    tag: achievement.tag._id,
    stages: achievement.stages._id,
  };
};

export default function TBodyData({ data }: TBodyDataProps) {
  const deleteCustomAchievementMutate = useDeleteCustomAchievement();

  const handleDeleteCustomAchievement = (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete: ${name}`)) return;
    deleteCustomAchievementMutate.mutate(id);
  };

  return (
    <>
      {data.map((achievement, index) => {
        return (
          <tr key={index} className="achievements-list-data-tbody">
            <td>
              {achievement.custom ? (
                <div>Custom achievement</div>
              ) : (
                <div>Default achievement</div>
              )}
              <EditAchievementButton achievement={achievement} />
              {achievement.custom ? (
                <Button
                  variant="danger"
                  onClick={() =>
                    handleDeleteCustomAchievement(
                      achievement._id,
                      achievement.name
                    )
                  }
                >
                  Delete
                </Button>
              ) : null}
            </td>
            <td>
              <TableDataWrapper>
                <div>Name </div>
                <div>{achievement.name}</div>
                <div>Enabled</div>
                <StatusLabel enabled={achievement.enabled}>
                  {achievement.enabled.toString().toUpperCase()}
                </StatusLabel>
                <div>Is time</div>
                <StatusLabel enabled={achievement.isTime}>
                  {achievement.isTime.toString().toUpperCase()}
                </StatusLabel>
              </TableDataWrapper>
            </td>

            <td>
              <TableDataWrapper>
                <div>Stages </div>
                <div>{achievement.stages.name}</div>
                <div>Tag</div>
                <StatusLabel enabled={achievement.tag.enabled}>
                  {achievement.tag.name}
                </StatusLabel>

                {achievement.hidden ? (
                  <>
                    <div>Hidden</div>
                    <StatusLabel enabled={achievement.hidden}>
                      {achievement.hidden.toString().toUpperCase() || "FALSE"}
                    </StatusLabel>
                  </>
                ) : null}
                {achievement.custom ? (
                  <>
                    <div>Custom action</div>
                    <div>{achievement.custom.action}</div>
                    <div>Case sensitive?</div>
                    <StatusLabel enabled={!!achievement.custom.caseSensitive}>
                      {achievement.custom.caseSensitive
                        ?.toString()
                        .toUpperCase() || "FALSE"}
                    </StatusLabel>
                  </>
                ) : null}
              </TableDataWrapper>
            </td>
            <td>
              <DateTooltip date={achievement.createdAt} />
              <DateTooltip date={achievement.updatedAt} />
            </td>
          </tr>
        );
      })}
    </>
  );
}

interface EditAchievementButtonProps {
  achievement: Achievement;
}

function EditAchievementButton({ achievement }: EditAchievementButtonProps) {
  const dispatch = useDispatch();

  return (
    <Button
      onClick={() => {
        dispatch(setEditingId(achievement._id));
        dispatch(
          setCurrentAction(
            achievement.custom
              ? ManageAchievementsCurrentAction.EDIT_CUSTOM
              : ManageAchievementsCurrentAction.EDIT
          )
        );
        dispatch(
          setAchievementState(getAchievementsStateDataHelper(achievement))
        );
        dispatch({ type: "SET_STATE", payload: achievement });
        dispatch(openModal());
      }}
    >
      Edit
    </Button>
  );
}
