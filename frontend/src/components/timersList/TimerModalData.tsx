import ModalDataWrapper from "@components/modalDataWrapper";
import { useGetAllModes, generateSelectModes } from "@utils";
import { useDispatch, useSelector } from "react-redux";
import { RootStore } from "@redux/store";
import {
  setDelay,
  setEnabled,
  setTag,
  setMood,
  setDescription,
  setMessages,
  setNonFollowMultiplier,
  setNonSubMultiplier,
  setRequirementPoints,
  setName,
} from "@redux/timersSlice";
import { Button } from "@components/ui";

export default function TimerModalData() {
  const modes = useGetAllModes();
  const { tags, moods } = modes;

  const dispatch = useDispatch();
  const timerState = useSelector((state: RootStore) => state.timers.timer);

  return (
    <ModalDataWrapper>
      <div>Name</div>
      <div>
        <input
          type="text"
          value={timerState.name}
          onChange={(e) => dispatch(setName(e.currentTarget.value))}
        />
      </div>
      <div> Enabled </div>
      <div>
        <Button
          onClick={() => dispatch(setEnabled(!timerState.enabled))}
          variant={timerState.enabled ? "primary" : "danger"}
        >
          {timerState.enabled.toString()}
        </Button>
      </div>
      <div>Non follow multi </div>
      <div>
        <Button
          onClick={() =>
            dispatch(setNonFollowMultiplier(!timerState.nonFollowMulti))
          }
          variant={timerState.nonFollowMulti ? "primary" : "danger"}
        >
          {timerState.nonFollowMulti.toString()}
        </Button>
      </div>
      <div>Non sub multi </div>
      <div>
        <Button
          onClick={() => dispatch(setNonSubMultiplier(!timerState.nonSubMulti))}
          variant={timerState.nonSubMulti ? "primary" : "danger"}
        >
          {timerState.nonSubMulti.toString()}
        </Button>
      </div>
      <div>Tag</div>
      <div>
        {generateSelectModes(timerState.tag, (e) => dispatch(setTag(e)), tags)}
      </div>
      <div>Mood</div>
      <div>
        {generateSelectModes(
          timerState.mood,
          (e) => dispatch(setMood(e)),
          moods
        )}
      </div>
      <div>Delay</div>
      <div>
        <input
          type="number"
          value={timerState.delay}
          onChange={(e) => dispatch(setDelay(e.currentTarget.valueAsNumber))}
        />
      </div>
      <div>Req points</div>
      <div>
        <input
          type="number"
          value={timerState.reqPoints}
          onChange={(e) =>
            dispatch(setRequirementPoints(e.currentTarget.valueAsNumber))
          }
        />
      </div>
      <div>description </div>
      <div>
        <input
          value={timerState.description}
          onChange={(e) => dispatch(setDescription(e.currentTarget.value))}
        />
      </div>
      <div>Messages</div>
      <div>
        <textarea
          value={timerState.messages?.join("\n")}
          onChange={(e) =>
            dispatch(setMessages(e.currentTarget.value?.split("\n") || []))
          }
        />
      </div>
    </ModalDataWrapper>
  );
}
