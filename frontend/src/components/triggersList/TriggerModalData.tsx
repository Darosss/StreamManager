import { useDispatch, useSelector } from "react-redux";
import ModalDataWrapper from "@components/modalDataWrapper";
import { TriggerMode } from "@services";
import { RootStore } from "@redux/store";
import {
  setChance,
  setDelay,
  setEnabled,
  setMessages,
  setMode,
  setMood,
  setName,
  setTag,
  setWords,
} from "@redux/triggersSlice";
import { Button } from "@components/ui/button";
import { SelectModes } from "@components/modesList";
import { useGetAllModes } from "@hooks";

export default function TriggerModalData() {
  const modes = useGetAllModes();
  const { tags, moods } = modes;

  const dispatch = useDispatch();
  const triggerState = useSelector(
    (state: RootStore) => state.triggers.trigger
  );

  return (
    <ModalDataWrapper>
      <div>Name</div>
      <div>
        <input
          type="text"
          value={triggerState.name}
          onChange={(e) => dispatch(setName(e.currentTarget.value))}
        />
      </div>
      <div> Enabled </div>
      <div>
        <Button
          onClick={() => dispatch(setEnabled(!triggerState.enabled))}
          variant={triggerState.enabled ? "success" : "danger"}
        >
          {triggerState.enabled.toString()}
        </Button>
      </div>
      <div>Chance </div>
      <div>
        <input
          type="number"
          value={triggerState.chance}
          onChange={(e) => dispatch(setChance(e.currentTarget.valueAsNumber))}
        />
      </div>
      <div>Mode </div>
      <div>
        <select
          value={triggerState.mode}
          onChange={(e) =>
            dispatch(setMode(e.currentTarget.value as TriggerMode))
          }
        >
          {(["ALL", "STARTS-WITH", "WHOLE-WORD"] as TriggerMode[]).map(
            (modeTrigger, index) => {
              return (
                <option key={index} value={modeTrigger}>
                  {modeTrigger}
                </option>
              );
            }
          )}
        </select>
      </div>
      <div>Tag</div>
      <div>
        <SelectModes
          value={triggerState.tag}
          onChange={(e) => dispatch(setTag(e))}
          data={tags}
        />
      </div>
      <div>Mood</div>
      <div>
        <SelectModes
          value={triggerState.mood}
          onChange={(e) => dispatch(setMood(e))}
          data={moods}
        />
      </div>

      <div>Delay</div>
      <div>
        <input
          type="number"
          value={triggerState.delay}
          onChange={(e) => dispatch(setDelay(e.currentTarget.valueAsNumber))}
        />
      </div>
      <div>Words</div>
      <div>
        <textarea
          value={triggerState.words?.join("\n")}
          onChange={(e) =>
            dispatch(setWords(e.currentTarget.value?.split("\n") || []))
          }
        />
      </div>
      <div>Messages</div>
      <div>
        <textarea
          value={triggerState.messages?.join("\n")}
          onChange={(e) =>
            dispatch(setMessages(e.currentTarget.value?.split("\n") || []))
          }
        />
      </div>
    </ModalDataWrapper>
  );
}
