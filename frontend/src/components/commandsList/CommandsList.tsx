import Modal from "@components/modal";
import NavigateButton from "@components/navigateButton";
import {
  ChatCommand,
  fetchChatCommandsDefaultParams,
  useCreateChatCommand,
  useEditChatCommand,
  useGetChatCommands,
} from "@services";
import { useDispatch, useSelector } from "react-redux";
import {
  resetCommandState,
  setEditingId,
  closeModal,
} from "@redux/commandsSlice";
import { RootStore } from "@redux/store";
import CommandModalData from "./CommandModalData";
import CommandsData from "./CommandsData";
import { Error, Loading } from "@components/axiosHelper";
import { useQueryParams } from "@hooks/useQueryParams";
import { TableList } from "@components/tableWrapper";
import { NOTIFICATION_TYPE, useNotifications } from "@contexts";
import Filter from "@components/filter";
import { getPossibleCommonField, Options } from "@components/filter/Filter";

export default function CommandsList() {
  const dispatch = useDispatch();
  const queryParams = useQueryParams(fetchChatCommandsDefaultParams);
  const { addNotify } = useNotifications();
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
      addNotify({
        title: "Couldn't update command",
        message: "No command id",
        type: NOTIFICATION_TYPE.WARNING,
      });
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
  const filterOpts: Options<keyof ChatCommand> = {
    ...getPossibleCommonField("search_name"),
    customId: { type: "search", placeholder: "Custom Id" },
  };
  return (
    <div>
      <div className="base-header-wrapper">
        <NavigateButton />
        <Filter options={filterOpts} />
      </div>
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
    </div>
  );
}
