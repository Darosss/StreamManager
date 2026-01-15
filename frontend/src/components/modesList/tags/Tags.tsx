import { Error, Loading } from "@components/axiosHelper";
import CardboxWrapper from "@components/cardboxWrapper";
import Modal from "@components/modal";
import NavigateButton from "@components/navigateButton";
import {
  fetchTagsDefaultParams,
  useGetTags,
  useCreateTag,
  useEditTag,
} from "@services";
import { useDispatch, useSelector } from "react-redux";
import { useQueryParams } from "@hooks/useQueryParams";
import { RootStore } from "@redux/store";
import { resetTagState, closeModal, setEditingId } from "@redux/tagsSlice";
import FilterBarModes from "../filterBarModes";
import TagModalData from "./TagModalData";
import TagsData from "./TagsData";
import { NOTIFICATION_TYPE, useNotifications } from "@contexts";

export default function Tags() {
  const { addNotify } = useNotifications();
  const queryParams = useQueryParams(fetchTagsDefaultParams);
  const { data: tags, isLoading, error } = useGetTags(queryParams);
  const dispatch = useDispatch();
  const {
    isModalOpen,
    tag: tagState,
    editingId,
  } = useSelector((state: RootStore) => state.tags);

  const createTagMutation = useCreateTag();
  const updateTagMutation = useEditTag();

  if (error) return <Error error={error} />;
  if (isLoading || !tags) return <Loading />;

  const handleCreateTag = () => {
    createTagMutation.mutate(tagState);
    dispatch(resetTagState());
  };

  const handleUpdateTag = () => {
    if (!editingId) {
      addNotify({
        title: "Couldn't update tag",
        message: "No tag id",
        type: NOTIFICATION_TYPE.WARNING,
      });
      return;
    }
    updateTagMutation.mutate({
      id: editingId,
      updatedTag: tagState,
    });
    dispatch(resetTagState());
    dispatch(setEditingId(""));
  };

  return (
    <>
      <NavigateButton />
      <FilterBarModes />
      <CardboxWrapper
        title={"Tags list"}
        paginationProps={{
          localStorageName: "tagsListPageSize",
          currentPage: tags.currentPage,
          totalCount: tags.count,
          siblingCount: 1,
        }}
      >
        <TagsData data={tags.data} />
      </CardboxWrapper>

      <Modal
        title={`${editingId ? "Edit" : "Create"} tag`}
        onClose={() => dispatch(closeModal())}
        onSubmit={() => (editingId ? handleUpdateTag() : handleCreateTag())}
        show={isModalOpen}
      >
        <TagModalData />
      </Modal>
    </>
  );
}
