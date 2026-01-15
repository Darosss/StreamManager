import { CardboxItem } from "@components/cardboxWrapper";
import { HandleShowModalParams } from "@components/types";
import { Button } from "@components/ui/button";
import {
  openModal,
  resetAffixState,
  setAffixState,
  setEditingId,
} from "@redux/affixesSlice";
import { Affix, useDeleteAffix } from "@services";
import { useDispatch } from "react-redux";

interface AffixesDataProps {
  data: Affix[];
}

export default function AffixesData({ data }: AffixesDataProps) {
  const dispatch = useDispatch();
  const deleteAffixMutation = useDeleteAffix();
  const handleDeleteAffix = (id: string) => {
    if (
      !window.confirm(
        `Are you sure you want to delete the affix with ID: ${id}?`
      )
    )
      return;
    deleteAffixMutation.mutate(id);
  };

  const handleShowModal = (params: HandleShowModalParams<Affix>) => {
    dispatch(openModal());
    if (params?.type === "create") {
      dispatch(resetAffixState());

      return;
    }
    const { type, data } = params;
    if (type === "edit") dispatch(setEditingId(data._id));
    dispatch(setAffixState(data));
  };
  return (
    <>
      <CardboxItem title="Create affix">
        <Button onClick={() => handleShowModal({ type: "create" })}>
          Create
        </Button>
      </CardboxItem>
      {data.map((affix, index) => {
        return (
          <CardboxItem
            title={affix.name}
            onClickX={() => {
              handleDeleteAffix(affix._id);
            }}
            key={index}
          >
            <Button
              onClick={() => handleShowModal({ type: "edit", data: affix })}
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
