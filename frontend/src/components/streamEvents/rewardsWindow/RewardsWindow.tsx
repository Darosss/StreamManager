import { useCallback, useEffect, useState } from "react";
import { CustomRewardData, useSocketContext } from "@socket";
import { useGetAlertSoundsMp3Names, useDeleteAlertSound } from "@services";
import { useDispatch } from "react-redux";
import {
  openModal,
  setEditingAlertSound,
  setRewardState,
} from "@redux/rewardsSlice";
import { RewardsModal } from "./RewardsModal";
import { Button } from "@components/ui/button";
import { NOTIFICATION_TYPE, useNotifications } from "@contexts";

export default function MessagesWindow() {
  const socketContext = useSocketContext();
  const { addNotify } = useNotifications();
  const dispatch = useDispatch();

  const [alertSounds, setAlertSounds] = useState<CustomRewardData[]>();

  const [alertSoundsServer, setAlertSoundsServer] = useState([""]);

  const { data: mp3AlertSounds, refetch: refetchMp3AlertSounds } =
    useGetAlertSoundsMp3Names();

  const deleteAlertSoundName = useDeleteAlertSound();

  const handleDeleteAlertSoundName = (name: string) => {
    if (
      !window.confirm(
        `Are you sure you want to delete the alert sound name: ${name}?`,
      )
    )
      return;
    deleteAlertSoundName.mutate(name, {
      onSuccess: () => refetchMp3AlertSounds(),
    });
  };

  useEffect(() => {
    if (!mp3AlertSounds) return;
    setAlertSoundsServer(mp3AlertSounds.data);
  }, [mp3AlertSounds]);

  useEffect(() => {
    const {
      emits: { getCustomRewards: emitGetCustomRewards },
      events: { getCustomRewards },
    } = socketContext;
    getCustomRewards.on((rewards) => {
      setAlertSounds(rewards);
    });

    emitGetCustomRewards();

    return () => {
      getCustomRewards.off();
    };
  }, [socketContext]);

  const emitRemoveAlertSoundReward = useCallback(
    (id: string, name: string) => {
      const {
        emits: { deleteCustomReward, getCustomRewards },
      } = socketContext;
      if (!window.confirm("Are you sure to delete custom reward?")) return;
      deleteCustomReward(id, (succes) => {
        if (!succes) {
          addNotify({
            title: "Custom reward couldn't be removed",
            type: NOTIFICATION_TYPE.DANGER,
          });
          return;
        }
        handleDeleteAlertSoundName(name);
        getCustomRewards();
        addNotify({
          title: "Custom reward removed successfully",
          type: NOTIFICATION_TYPE.SUCCESS,
        });
      });
    },
    [socketContext, addNotify],
  );

  const isAlertSoundMp3OnServer = (rewardTitle: string) => {
    return alertSoundsServer.some((snd) => snd.includes(rewardTitle));
  };

  return (
    <>
      <div className="widget-header"> Stream alert sounds </div>
      <div className="custom-rewards-window">
        <div>
          <Button onClick={() => dispatch(openModal())}>New alert sound</Button>
        </div>
        {alertSounds?.map((reward, index) => (
          <div
            key={index}
            style={{
              background: `${
                isAlertSoundMp3OnServer(reward.title) ? "green" : "red"
              }`,
            }}
          >
            <div>{reward.title}</div>
            <div>{reward.cost}</div>
            <div>
              <Button
                onClick={() => {
                  dispatch(setEditingAlertSound(reward.id));
                  dispatch(setRewardState(reward));
                }}
              >
                Edit
              </Button>
            </div>
            <div>
              <Button
                onClick={() =>
                  emitRemoveAlertSoundReward(reward.id, reward.title)
                }
                variant="danger"
              >
                X
              </Button>
            </div>
          </div>
        ))}
      </div>
      <RewardsModal />
    </>
  );
}
