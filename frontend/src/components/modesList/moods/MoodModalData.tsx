import ModalDataWrapper from "@components/modalDataWrapper";
import { useAppDispatch, useAppSelector } from "@redux";
import { setName } from "@redux/moodsSlice";

export default function MoodModalData() {
  const dispatch = useAppDispatch();
  const moodState = useAppSelector((state) => state.moods.mood);
  const { name } = moodState;
  return (
    <ModalDataWrapper>
      <div>Name</div>
      <div>
        <input
          type="text"
          value={name}
          onChange={(e) => {
            dispatch(setName(e.currentTarget.value));
          }}
        />
      </div>
    </ModalDataWrapper>
  );
}
