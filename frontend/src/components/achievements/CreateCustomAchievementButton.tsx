import { CustomAchievementAction } from "@services";
import { useDispatch } from "react-redux";
import {
  AchievementSliceDataType,
  ManageAchievementsCurrentAction,
  openModal,
  setAchievementState,
  setCurrentAction,
  setEditingId,
} from "@redux/achievementsSlice";
import { Button } from "@components/ui/button";

const initialAchievementData: Required<AchievementSliceDataType> = {
  name: "",
  description: "",
  isTime: false,
  enabled: true,
  stages: "",
  tag: "",
  custom: { action: CustomAchievementAction.ALL },
  hidden: false,
};

export function CreateCustomAchievementButton() {
  const dispatch = useDispatch();
  return (
    <div>
      <Button
        size="small"
        variant="success"
        onClick={() => {
          dispatch(openModal());

          dispatch(
            setCurrentAction(ManageAchievementsCurrentAction.CREATE_CUSTOM)
          );
          dispatch(setAchievementState(initialAchievementData));
          dispatch(setEditingId(""));
        }}
      >
        Create custom
      </Button>
    </div>
  );
}
