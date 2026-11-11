import ModalDataWrapper from "@components/modalDataWrapper";

import { useAppDispatch, useAppSelector } from "@redux";

import {
  setMessages,
  setMood,
  setName,
  setTag,
  toggleEnabled,
} from "@redux/messageCategoriesSlice";
import { Button } from "@components/ui/button";
import { SelectModes } from "@components/modesList";
import { useGetAllModes } from "@hooks";

export default function CategoriesModalData() {
  const modes = useGetAllModes();
  const dispatch = useAppDispatch();
  const messageCategoryState = useAppSelector(
    (state) => state.messageCategories.messageCategory,
  );
  const { tags, moods } = modes;
  return (
    <ModalDataWrapper>
      <div>Name</div>
      <div>
        <input
          className="categories-list-modal-input"
          type="text"
          value={messageCategoryState.name}
          onChange={(e) => dispatch(setName(e.target.value))}
        />
      </div>
      <div> Enabled </div>
      <div>
        <Button
          onClick={() => dispatch(toggleEnabled())}
          variant={messageCategoryState.enabled ? "primary" : "danger"}
        >
          {messageCategoryState.enabled.toString()}
        </Button>
      </div>
      <div>Tag</div>
      <div>
        <SelectModes
          value={messageCategoryState.tag}
          onChange={(e) => dispatch(setTag(e))}
          data={tags}
        />
      </div>
      <div>Mood</div>
      <div>
        <SelectModes
          value={messageCategoryState.mood}
          onChange={(e) => dispatch(setMood(e))}
          data={moods}
        />
      </div>
      <div>Messages</div>
      <div>
        <textarea
          className="categories-list-textarea"
          value={messageCategoryState.messages?.join("\n")}
          onChange={(e) => dispatch(setMessages(e.target.value?.split("\n")))}
        />
      </div>
    </ModalDataWrapper>
  );
}
