import { CardboxItem } from "@components/cardboxWrapper";
import { HandleShowModalParams } from "@components/types";
import { Button } from "@components/ui";
import {
  openModal,
  resetMoodState,
  setEditingId,
  setMoodState,
} from "@redux/moodsSlice";
import { Mood, useDeleteMood } from "@services";
import { useDispatch } from "react-redux";

interface MoodsDataProps {
  data: Mood[];
}

export default function MoodsData({ data }: MoodsDataProps) {
  const dispatch = useDispatch();
  const deleteMoodMutation = useDeleteMood();
  const handleDeleteMood = (id: string) => {
    if (
      !window.confirm(
        `Are you sure you want to delete the mood with ID: ${id}?`
      )
    )
      return;
    deleteMoodMutation.mutate(id);
  };

  const handleShowModal = (params: HandleShowModalParams<Mood>) => {
    dispatch(openModal());
    if (params?.type === "create") {
      dispatch(resetMoodState());

      return;
    }
    const { type, data } = params;
    if (type === "edit") dispatch(setEditingId(data._id));
    dispatch(setMoodState(data));
  };
  return (
    <>
      <CardboxItem title="Create mood">
        <Button onClick={() => handleShowModal({ type: "create" })}>
          Create
        </Button>
      </CardboxItem>
      {data.map((mood, index) => {
        return (
          <CardboxItem
            title={mood.name}
            onClickX={() => {
              handleDeleteMood(mood._id);
            }}
            key={index}
          >
            <Button
              onClick={() => handleShowModal({ type: "edit", data: mood })}
              className="edit-mode-button"
            >
              Edit
            </Button>
          </CardboxItem>
        );
      })}
    </>
  );
}
