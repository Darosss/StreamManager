import {
  useEditAchievementStage,
  useRefetchAchievementStageById,
} from "@services";
import { useDispatch, useSelector } from "react-redux";
import { RootStore } from "@redux/store";
import { pushToStageData } from "@redux/stagesSlice";
import { Button } from "@components/ui/button";
import { NOTIFICATION_TYPE, useNotifications } from "@contexts";

interface ActionButtonsProps {
  stageId: string;
  editing: boolean;
  onCancelEdit: () => void;
  onClickEdit: () => void;
  onClickSave: () => void;
}
export default function ActionButtons({
  stageId,
  editing,
  onCancelEdit,
  onClickEdit,
  onClickSave,
}: ActionButtonsProps) {
  const dispatch = useDispatch();

  const { stage } = useSelector((root: RootStore) => root.stages);
  const { addNotify } = useNotifications();
  const editAchievementStageMutation = useEditAchievementStage();
  const handleOnClickAddStage = () => {
    const { stageData } = stage;
    const stageDataLen = stageData.length;
    const previousStageData = stageData[stageDataLen - 1];

    dispatch(
      pushToStageData(
        previousStageData
          ? {
              name: `Stage ${stageDataLen + 1}`,
              stage: stageDataLen + 1,
              goal: previousStageData.goal * 2,
              badge: previousStageData.badge,
              sound: previousStageData.sound,
              rarity: previousStageData.rarity,
              showTimeMs: previousStageData.showTimeMs,
            }
          : {
              name: "New stage",
              stage: 1,
              goal: 1,
              rarity: 1,
              badge: {
                _id: "",
                name: "",
                description: "",
                imagesUrls: { x32: "", x64: "", x96: "", x128: "" },
                createdAt: new Date(),
                updatedAt: new Date(),
              },
              showTimeMs: 2500,
            }
      )
    );
  };
  const refetchAchievementStageById = useRefetchAchievementStageById();

  const handleEditAchievementStage = () => {
    const { createdAt, updatedAt, stageData, ...rest } = stage;
    editAchievementStageMutation.mutate({
      id: stageId,
      updatedAchievementStage: {
        ...rest,
        stageData: stageData.map((stageData) => ({
          ...stageData,
          badge: stageData.badge._id,
        })),
      },
    });
  };

  const handleOnClickSave = () => {
    const isBadgeSet = stage.stageData.every(
      (stageData) => stageData.badge._id
    );
    if (!isBadgeSet)
      return addNotify({
        title: "Badge is not set properly",
        type: NOTIFICATION_TYPE.DANGER,
      });
    onClickSave();
    handleEditAchievementStage();
  };

  return (
    <>
      {editing ? (
        <>
          <Button
            variant="danger"
            onClick={() => {
              onCancelEdit();
              refetchAchievementStageById(stageId);
            }}
          >
            Cancel edit
          </Button>
          <Button variant="success" onClick={handleOnClickSave}>
            Save
          </Button>
          <Button onClick={handleOnClickAddStage}>Add stage</Button>
        </>
      ) : (
        <Button onClick={onClickEdit}>Edit</Button>
      )}
    </>
  );
}
