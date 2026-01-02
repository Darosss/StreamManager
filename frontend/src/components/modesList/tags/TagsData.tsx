import { CardboxItem } from "@components/cardboxWrapper";
import { HandleShowModalParams } from "@components/types";
import { Button } from "@components/ui";
import {
  openModal,
  resetTagState,
  setEditingId,
  setTagState,
} from "@redux/tagsSlice";
import { Tag, useDeleteTag } from "@services";
import { useDispatch } from "react-redux";

interface TagsDataProps {
  data: Tag[];
}

export default function TagsData({ data }: TagsDataProps) {
  const dispatch = useDispatch();
  const deleteTagMutation = useDeleteTag();
  const handleDeleteTag = (id: string) => {
    if (
      !window.confirm(`Are you sure you want to delete the tag with ID: ${id}?`)
    )
      return;
    deleteTagMutation.mutate(id);
  };
  const handleShowModal = (params: HandleShowModalParams<Tag>) => {
    dispatch(openModal());
    if (params?.type === "create") {
      dispatch(resetTagState());

      return;
    }
    const { type, data } = params;
    if (type === "edit") dispatch(setEditingId(data._id));
    dispatch(setTagState(data));
  };
  return (
    <>
      <CardboxItem title="Create tag">
        <Button onClick={() => handleShowModal({ type: "create" })}>
          Create
        </Button>
      </CardboxItem>
      {data.map((tag, index) => {
        return (
          <CardboxItem
            title={tag.name}
            onClickX={() => {
              handleDeleteTag(tag._id);
            }}
            key={index}
          >
            <Button
              onClick={() => handleShowModal({ type: "edit", data: tag })}
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
