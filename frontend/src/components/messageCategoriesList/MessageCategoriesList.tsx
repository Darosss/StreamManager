import NavigateButton from "@components/navigateButton";
import {
  useCreateMessageCategory,
  useGetMessageCategories,
  useEditMessageCategory,
  fetchMessageCategoriesDefaultParams,
  MessageCategory,
} from "@services";
import Modal from "@components/modal";
import CategoriesData from "./CategoriesData";
import CategoriesModalData from "./CategoriesModalData";
import { Error, Loading } from "@components/axiosHelper";
import {
  closeModal,
  resetMessageCategoryState,
  setEditingId,
} from "@redux/messageCategoriesSlice";
import { RootStore } from "@redux/store";
import { useDispatch, useSelector } from "react-redux";
import { useQueryParams } from "@hooks/useQueryParams";
import { TableList } from "@components/tableWrapper";
import { NOTIFICATION_TYPE, useNotifications } from "@contexts";
import Filter from "@components/filter";
import { Options } from "@components/filter/Filter";

export default function MessageCategoriesList() {
  const { addNotify } = useNotifications();
  const queryParams = useQueryParams(fetchMessageCategoriesDefaultParams);
  const {
    data: messageCategories,
    isLoading,
    error,
  } = useGetMessageCategories(queryParams);
  const dispatch = useDispatch();
  const {
    isModalOpen,
    messageCategory: messageCategoryState,
    editingId,
  } = useSelector((state: RootStore) => state.messageCategories);

  const createMessageCategoryMutation = useCreateMessageCategory();
  const updateMessageCategoryMutation = useEditMessageCategory();

  if (error) return <Error error={error} />;
  if (isLoading || !messageCategories) return <Loading />;

  const handleCreateMessageCategory = () => {
    createMessageCategoryMutation.mutate(messageCategoryState);
    dispatch(resetMessageCategoryState());
    dispatch(closeModal());
  };

  const handleUpdateMessageCategory = () => {
    if (!editingId) {
      addNotify({
        title: "Couldn't update message category",
        message: "No message category id",
        type: NOTIFICATION_TYPE.WARNING,
      });
      return;
    }
    updateMessageCategoryMutation.mutate({
      id: editingId,
      updatedMessageCategory: messageCategoryState,
    });
    dispatch(resetMessageCategoryState());
    dispatch(closeModal());
    dispatch(setEditingId(""));
  };
  const filterOpts: Options<keyof MessageCategory> = {
    category: { type: "text", placeholder: "Category" },
    messages: { type: "text", placeholder: "Messages" },
    privilege: { type: "text", placeholder: "Privilege" },
  };
  return (
    <div>
      <div className="base-header-wrapper">
        <NavigateButton />
        <Filter options={filterOpts} />
      </div>

      <TableList
        paginationProps={{
          localStorageName: "messageCategoriesPageSize",
          currentPage: messageCategories.currentPage,
          totalCount: messageCategories.count,
          siblingCount: 1,
        }}
      >
        <CategoriesData data={messageCategories.data} />
      </TableList>
      <Modal
        title={`${editingId ? "Edit" : "Create"} message category`}
        onClose={() => dispatch(closeModal())}
        onSubmit={() => {
          editingId
            ? handleUpdateMessageCategory()
            : handleCreateMessageCategory();
        }}
        show={isModalOpen}
      >
        <CategoriesModalData />
      </Modal>
    </div>
  );
}
