import ModalDataWrapper from "@components/modalDataWrapper";
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
import { Button } from "@components/ui/button";
import { useGetAllModes } from "@hooks";
import { SelectModes } from "@components/modesList";
import { useDebouncedValue } from "@hooks/useDebouncedValue";
import { useEffect, useState } from "react";

const MIN_TIMER_DELAY = 60000;

export default function TimerModalData() {
  const modes = useGetAllModes();
  const { tags, moods } = modes;

  const dispatch = useDispatch();
  const timerState = useSelector((state: RootStore) => state.timers.timer);
  const [localDelay, setLocalDelay] = useState(timerState.delay);
  const debouncedDelay = useDebouncedValue(localDelay, 500);

  useEffect(() => {
    if (Number.isNaN(debouncedDelay)) return;

    const val = Math.max(debouncedDelay, MIN_TIMER_DELAY);
    dispatch(setDelay(val));
  }, [debouncedDelay, dispatch]);

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
        <SelectModes
          value={timerState.tag}
          onChange={(e) => dispatch(setTag(e))}
          data={tags}
        />
      </div>
      <div>Mood</div>
      <div>
        <SelectModes
          value={timerState.mood}
          onChange={(e) => dispatch(setMood(e))}
          data={moods}
        />
      </div>
      <div>Delay</div>
      <div>
        <input
          type="number"
          value={localDelay}
          onChange={(e) => setLocalDelay(e.currentTarget.valueAsNumber)}
          onBlur={() => {
            if (localDelay < MIN_TIMER_DELAY) setLocalDelay(MIN_TIMER_DELAY);
          }}
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
