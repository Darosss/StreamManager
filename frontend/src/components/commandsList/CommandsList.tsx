import Modal from "@components/modal";
import NavigateButton from "@components/navigateButton";
import {
  fetchChatCommandsDefaultParams,
  useCreateChatCommand,
  useEditChatCommand,
  useGetChatCommands,
} from "@services";
import { addNotification } from "@utils";
import { useDispatch, useSelector } from "react-redux";
import {
  resetCommandState,
  setEditingId,
  closeModal,
} from "@redux/commandsSlice";
import { RootStore } from "@redux/store";
import CommandModalData from "./CommandModalData";
import CommandsData from "./CommandsData";
import FilterBarCommands from "./filterBarCommands";
import { Error, Loading } from "@components/axiosHelper";
import { useQueryParams } from "@hooks/useQueryParams";
import { TableList } from "@components/tableWrapper";

export default function CommandsList() {
  const dispatch = useDispatch();
  const queryParams = useQueryParams(fetchChatCommandsDefaultParams);

  const {
    isModalOpen,
    command: commandState,
    editingId,
  } = useSelector((state: RootStore) => state.commands);

  const createCommandMutation = useCreateChatCommand();
  const updateCommandMutation = useEditChatCommand();

  const {
    data: commandsData,
    isLoading,
    error,
  } = useGetChatCommands(queryParams);

  const handleCreateCommand = () => {
    createCommandMutation.mutate(commandState);
    dispatch(closeModal());
    dispatch(resetCommandState());
  };

  const handleUpdateCommand = () => {
    if (!editingId) {
      addNotification("Couldn't update command", "No command id", "warning");
      return;
    }
    updateCommandMutation.mutate({
      id: editingId,
      updatedChatCommand: commandState,
    });
    dispatch(closeModal());
    dispatch(resetCommandState());
    dispatch(setEditingId(""));
  };
  if (error) return <Error error={error} />;
  if (isLoading || !commandsData) return <Loading />;

  return (
    <>
      <NavigateButton />
      <FilterBarCommands />
      <TableList
        paginationProps={{
          localStorageName: "commandsListPageSize",
          currentPage: commandsData.currentPage,
          totalCount: commandsData.count,
          siblingCount: 1,
        }}
      >
        <CommandsData commands={commandsData.data} />
      </TableList>

      <Modal
        title={`${editingId ? "Edit" : "Create"} command`}
        onClose={() => dispatch(closeModal())}
        onSubmit={() =>
          editingId ? handleUpdateCommand() : handleCreateCommand()
        }
        show={isModalOpen}
      >
        <CommandModalData />
      </Modal>
    </>
  );
}
