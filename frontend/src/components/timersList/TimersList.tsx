import Modal from "@components/modal";
import NavigateButton from "@components/navigateButton";
import {
  useGetTimers,
  useEditTimer,
  useCreateTimer,
  fetchTimersDefaultParams,
  Timer,
} from "@services";
import TimersData from "./TimersData";
import TimerModalData from "./TimerModalData";
import { useQueryParams } from "@hooks/useQueryParams";
import { RootStore } from "@redux/store";
import { closeModal, resetTimerState, setEditingId } from "@redux/timersSlice";
import { useDispatch, useSelector } from "react-redux";
import { Error, Loading } from "@components/axiosHelper";
import { TableList } from "@components/tableWrapper";
import { NOTIFICATION_TYPE, useNotifications } from "@contexts";
import Filter from "@components/filter";
import { Options, getPossibleCommonField } from "@components/filter/Filter";

export default function TimersList() {
  const queryParams = useQueryParams(fetchTimersDefaultParams);
  const { addNotify } = useNotifications();
  const { data: timers, isLoading, error } = useGetTimers(queryParams);
  const dispatch = useDispatch();
  const {
    isModalOpen,
    timer: timerState,
    editingId,
  } = useSelector((state: RootStore) => state.timers);
  const createTimerMutation = useCreateTimer();
  const updateTimerMutation = useEditTimer();

  if (error) return <Error error={error} />;
  if (isLoading || !timers) return <Loading />;

  const handleCreateTimer = () => {
    createTimerMutation.mutate(timerState);
    dispatch(resetTimerState());
    dispatch(closeModal());
  };

  const handleUpdateTimer = () => {
    if (!editingId) {
      addNotify({
        title: "Couldn't update timer",
        message: "No timer id",
        type: NOTIFICATION_TYPE.WARNING,
      });
      return;
    }
    updateTimerMutation.mutate({
      id: editingId,
      updatedTimer: timerState,
    });
    dispatch(resetTimerState());
    dispatch(setEditingId(""));
    dispatch(closeModal());
  };
  const filterOpts: Options<keyof Timer> = {
    ...getPossibleCommonField("search_name"),
    messages: { type: "text", placeholder: "Messages" },
  };
  return (
    <div>
      <div className="base-header-wrapper">
        <NavigateButton />
        <Filter options={filterOpts} />
      </div>
      <TableList
        paginationProps={{
          localStorageName: "timersListPageSize",
          currentPage: timers.currentPage,
          totalCount: timers.count,
          siblingCount: 1,
        }}
      >
        <TimersData data={timers.data} />
      </TableList>
      <Modal
        title={`${editingId ? "Edit" : "Create"} timer`}
        onClose={() => dispatch(closeModal())}
        onSubmit={() => {
          editingId ? handleUpdateTimer() : handleCreateTimer();
        }}
        show={isModalOpen}
      >
        <TimerModalData />
      </Modal>
    </div>
  );
}
