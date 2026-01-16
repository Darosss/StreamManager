import Modal from "@components/modal";
import NavigateButton from "@components/navigateButton";
import {
  useGetTriggers,
  useEditTrigger,
  useCreateTrigger,
  fetchTriggersDefaultParams,
  Trigger,
} from "@services";
import TriggersData from "./TriggersData";
import TriggerModalData from "./TriggerModalData";
import { Loading } from "@components/axiosHelper";
import { useDispatch, useSelector } from "react-redux";
import { useQueryParams } from "@hooks/useQueryParams";
import { RootStore } from "@redux/store";
import Error from "@components/axiosHelper/errors";
import {
  closeModal,
  resetTriggerState,
  setEditingId,
} from "@redux/triggersSlice";
import { TableList } from "@components/tableWrapper";
import { NOTIFICATION_TYPE, useNotifications } from "@contexts";
import Filter from "@components/filter";
import { getPossibleCommonField, Options } from "@components/filter/Filter";

export default function TriggersList() {
  const queryParams = useQueryParams(fetchTriggersDefaultParams);
  const { addNotify } = useNotifications();
  const { data: triggers, isLoading, error } = useGetTriggers(queryParams);
  const dispatch = useDispatch();
  const {
    isModalOpen,
    trigger: triggerState,
    editingId,
  } = useSelector((state: RootStore) => state.triggers);

  const createTriggerMutation = useCreateTrigger();
  const updateTriggerMutation = useEditTrigger();

  if (error) return <Error error={error} />;
  if (isLoading || !triggers) return <Loading />;
  const handleCreateTrigger = () => {
    createTriggerMutation.mutate(triggerState);
    dispatch(resetTriggerState());
    dispatch(closeModal());
  };

  const handleUpdateTrigger = () => {
    if (!editingId) {
      addNotify({
        title: "Couldn't update trigger",
        message: "No trigger id",
        type: NOTIFICATION_TYPE.WARNING,
      });
      return;
    }
    updateTriggerMutation.mutate({
      id: editingId,
      updatedTrigger: triggerState,
    });
    dispatch(resetTriggerState());
    dispatch(setEditingId(""));
    dispatch(closeModal());
  };
  const filterOpts: Options<keyof Trigger> = {
    ...getPossibleCommonField("search_name"),
    words: { type: "search", placeholder: "Words" },
    messages: { type: "search", placeholder: "Messages" },
    ...getPossibleCommonField("end_date"),
    ...getPossibleCommonField("start_date"),
  };
  return (
    <div>
      <div className="base-header-wrapper">
        <NavigateButton />
        <Filter options={filterOpts} />
      </div>
      <TableList
        paginationProps={{
          localStorageName: "triggersListPageSize",
          currentPage: triggers.currentPage,
          totalCount: triggers.count,
          siblingCount: 1,
        }}
      >
        <TriggersData data={triggers.data} />
      </TableList>
      <Modal
        title={`${editingId ? "Edit" : "Create"} trigger`}
        onClose={() => dispatch(closeModal())}
        onSubmit={() => {
          editingId ? handleUpdateTrigger() : handleCreateTrigger();
        }}
        show={isModalOpen}
      >
        <TriggerModalData />
      </Modal>
    </div>
  );
}
