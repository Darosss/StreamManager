import ModalDataWrapper from "@components/modalDataWrapper";

import { useAppDispatch, useAppSelector } from "@redux";
import { setName } from "@redux/tagsSlice";

export default function TagModalData() {
  const dispatch = useAppDispatch();
  const tagState = useAppSelector((state) => state.tags.tag);
  const { name } = tagState;
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
