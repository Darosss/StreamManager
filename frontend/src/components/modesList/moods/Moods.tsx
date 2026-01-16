import { Error, Loading } from "@components/axiosHelper";
import CardboxWrapper from "@components/cardboxWrapper";
import Modal from "@components/modal";
import NavigateButton from "@components/navigateButton";
import {
  fetchMoodsDefaultParams,
  useGetMoods,
  useCreateMood,
  useEditMood,
  Mood,
} from "@services";
import { useDispatch, useSelector } from "react-redux";
import { useQueryParams } from "@hooks/useQueryParams";
import { closeModal, resetMoodState, setEditingId } from "@redux/moodsSlice";
import { RootStore } from "@redux/store";
import MoodsData from "./MoodsData";
import MoodModalData from "./MoodModalData";
import { NOTIFICATION_TYPE, useNotifications } from "@contexts";
import Filter from "@components/filter";
import { getPossibleCommonField, Options } from "@components/filter/Filter";

export default function Moods() {
  const { addNotify } = useNotifications();
  const queryParams = useQueryParams(fetchMoodsDefaultParams);
  const { data: moods, isLoading, error } = useGetMoods(queryParams);
  const dispatch = useDispatch();
  const {
    isModalOpen,
    mood: moodState,
    editingId,
  } = useSelector((state: RootStore) => state.moods);

  const createMoodMutation = useCreateMood();
  const updateMoodMutation = useEditMood();

  if (error) return <Error error={error} />;
  if (isLoading || !moods) return <Loading />;

  const handleCreateMood = () => {
    createMoodMutation.mutate(moodState);
    dispatch(resetMoodState());
  };

  const handleUpdateMood = () => {
    if (!editingId) {
      addNotify({
        title: "Couldn't update mood",
        message: "No mood id",
        type: NOTIFICATION_TYPE.WARNING,
      });
      return;
    }
    updateMoodMutation.mutate({
      id: editingId,
      updatedMood: moodState,
    });
    dispatch(resetMoodState());
    dispatch(setEditingId(""));
  };
  const filterOpts: Options<keyof Mood> = {
    ...getPossibleCommonField("search_name"),
  };
  return (
    <div>
      <div className="base-header-wrapper">
        <NavigateButton />
        <Filter options={filterOpts} />
      </div>
      <div className="moods-data-wrapper">
        <CardboxWrapper
          title={"Moods list"}
          paginationProps={{
            localStorageName: "moodsListPageSize",
            currentPage: moods.currentPage,
            totalCount: moods.count,
            siblingCount: 1,
          }}
        >
          <MoodsData data={moods.data} />
        </CardboxWrapper>
      </div>
      <Modal
        title={`${editingId ? "Edit" : "Create"} mood`}
        onClose={() => dispatch(closeModal())}
        onSubmit={() => (editingId ? handleUpdateMood() : handleCreateMood())}
        show={isModalOpen}
      >
        <MoodModalData />
      </Modal>
    </div>
  );
}
