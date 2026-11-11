import { useState } from "react";
import NavigateButton from "@components/navigateButton";
import { TableListWrapper } from "@components/tableWrapper";
import Modal from "@components/modal";
import ModalBadgesList from "../badges/ModalBadgesList";
import BaseDetailsAchievementStage from "./BaseDetailsAchievementStage";
import ActionButtons from "./ActionButtons";
import AchievementStageTheadData from "./AchievementStageTheadData";
import AchievementStageEditData from "./AchievementStageEditData";
import AchievementStageDisplayData from "./AchievementStageDisplayData";
import { useAppDispatch, useAppSelector } from "@redux";
import {
  closeModal,
  openModal,
  updateStageStageDataBadgeByIndex,
} from "@redux/stagesSlice";

import { useGetAchievementStageById } from "@services";
import { useParams } from "react-router";
import { Error, Loading } from "@components/axiosHelper";

export default function OneAchievementStageData() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const [editing, setEditing] = useState(false);
  const { isModalOpen } = useAppSelector((state) => state.stages);
  const [currentEditingStageData, setCurrentEditingStageData] = useState(-1);

  const {
    data: achievementStageData,
    error,
    isLoading,
  } = useGetAchievementStageById(id || "");

  if (error) return <Error error={error} />;
  if (isLoading || !achievementStageData) return <Loading />;

  return (
    <div>
      <div className="base-header-wrapper">
        <NavigateButton />
      </div>
      <div className="one-achievement-stage-data">
        <div className="default-data">
          {id ? (
            <div>
              <ActionButtons
                stageId={id}
                editing={editing}
                onCancelEdit={() => setEditing(false)}
                onClickEdit={() => setEditing(true)}
                onClickSave={() => setEditing(false)}
              />
            </div>
          ) : null}
          <div className="base-details-achievement-stage-wrapper">
            <BaseDetailsAchievementStage editing={editing} />
          </div>
        </div>

        <div className="stage-data-wrapper">
          <TableListWrapper
            theadChildren={<AchievementStageTheadData editing={editing} />}
            tbodyChildren={
              editing ? (
                <AchievementStageEditData
                  onClickBadge={(index) => {
                    setCurrentEditingStageData(index);
                    dispatch(openModal());
                  }}
                />
              ) : (
                <AchievementStageDisplayData
                  stageData={achievementStageData.data.stageData}
                />
              )
            }
          />
        </div>
      </div>

      <Modal show={isModalOpen} onClose={() => dispatch(closeModal())}>
        <ModalBadgesList
          onClickBadge={(badge) => {
            dispatch(
              updateStageStageDataBadgeByIndex({
                index: currentEditingStageData,
                badge,
              }),
            );

            setCurrentEditingStageData(-1);
            dispatch(closeModal());
          }}
        />
      </Modal>
    </div>
  );
}
