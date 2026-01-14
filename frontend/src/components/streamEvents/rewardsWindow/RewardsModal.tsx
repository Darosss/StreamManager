import Modal from "@components/modal";
import { NOTIFICATION_TYPE, useNotifications } from "@contexts";
import { useFileUpload } from "@hooks";
import { setCost, setEditingAlertSound, closeModal } from "@redux/rewardsSlice";
import { setTitle } from "@redux/songsSlice";
import { RootStore } from "@redux/store";
import { uploadMp3Data } from "@services";
import { useSocketContext } from "@socket";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export function RewardsModal() {
  const socketContext = useSocketContext();
  const { addNotify } = useNotifications();
  const [fileList, setFileList] = useState<FileList | null>(null);

  const { handleFileUpload } = useFileUpload(uploadMp3Data.rewardsAlertSounds);
  const {
    reward: { title, cost },
    isModalOpen,
    editingId,
  } = useSelector((state: RootStore) => state.rewards);

  const dispatch = useDispatch();

  const emitEditAlertSoundReward = useCallback(() => {
    const {
      emits: { updateCustomReward },
    } = socketContext;
    if (!editingId) return;
    if (fileList && fileList.length <= 0) {
      addNotify({
        title: "You must add sound file to update alert sound",
        type: NOTIFICATION_TYPE.DANGER,
      });
      return;
    }
    updateCustomReward(editingId, { title, cost }, (success) => {
      if (!success) {
        addNotify({
          title: "Custom reward couldn't be created",
          type: NOTIFICATION_TYPE.DANGER,
        });
        return;
      }

      handleFileUpload(
        {
          fileList: fileList,
          bodySingleFileName: { bodyName: "title", value: title },
        },
        "alertSound"
      );

      setFileList(null);
      addNotify({
        title: "Custom reward created successfully",
        type: NOTIFICATION_TYPE.SUCCESS,
      });
    });
  }, [
    socketContext,
    editingId,
    fileList,
    title,
    cost,
    addNotify,
    handleFileUpload,
  ]);
  const emitCreateAlertSoundReward = useCallback(() => {
    if (!title || !fileList) return;
    const {
      emits: { getCustomRewards, createCustomReward },
    } = socketContext;
    if (fileList && fileList.length <= 0) {
      addNotify({
        title: "You must add sound file to create alert sound",
        type: NOTIFICATION_TYPE.DANGER,
      });
      return;
    }
    createCustomReward({ title: title, cost: cost }, (success) => {
      if (!success) {
        addNotify({
          title: "Custom reward couldn't be created",
          type: NOTIFICATION_TYPE.DANGER,
        });
        return;
      }

      handleFileUpload(
        {
          fileList: fileList,
          bodySingleFileName: { bodyName: "title", value: title },
        },
        "alertSound"
      );
      setFileList(null);
      addNotify({
        title: "Custom reward created successfully",
        type: NOTIFICATION_TYPE.SUCCESS,
      });
    });

    getCustomRewards();
  }, [addNotify, socketContext, fileList, handleFileUpload, title, cost]);

  return (
    <Modal
      title={`${editingId ? "Edit" : "Create"} alert sound reward`}
      onClose={() => {
        dispatch(closeModal());
        dispatch(setEditingAlertSound(""));
      }}
      onSubmit={() => {
        editingId ? emitEditAlertSoundReward() : emitCreateAlertSoundReward();
      }}
      show={isModalOpen}
    >
      <div className="alert-sound-reward-modal">
        <div>
          <div>Reward title</div>
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => dispatch(setTitle(e.target.value))}
            />
          </div>
        </div>
        <div>
          <div>Reward cost</div>
          <div>
            <input
              type="number"
              value={cost}
              onChange={(e) => dispatch(setCost(e.target.valueAsNumber))}
            />
          </div>
        </div>
        <div>
          <div>Alert sound mp3</div>
          <div>
            <input
              type="file"
              name="file"
              onChange={(e) => {
                setFileList(e.target.files);
              }}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}
