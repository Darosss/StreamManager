import { generateEnabledDisabledDiv } from "@utils";
import {
  TableDataWrapper,
  TableItemsListWrapper,
  TableListWrapper,
} from "@components/tableWrapper";
import {
  MessageCategory,
  MessageCategoryCreateData,
  useDeleteMessageCategory,
} from "@services";
import SortByParamsButton from "@components/SortByParamsButton";
import { useDispatch } from "react-redux";
import {
  openModal,
  resetMessageCategoryState,
  setEditingId,
  setMessageCategoryState,
} from "@redux/messageCategoriesSlice";
import { HandleShowModalParams } from "@components/types";
import { Button } from "@components/ui";

interface CategoriesDataProps {
  data: MessageCategory[];
}
const getMessageCategoryStateDataHelper = (
  messageCategory: MessageCategory
): MessageCategoryCreateData => {
  return {
    ...messageCategory,
    messages: messageCategory.messages.map(([mess]) => mess),
    tag: messageCategory.tag._id,
    mood: messageCategory.mood._id,
  };
};

export default function CategoriesData({ data }: CategoriesDataProps) {
  const dispatch = useDispatch();

  const deleteMsgCategoryMutation = useDeleteMessageCategory();
  const handleDeleteMessageCategory = (id: string) => {
    if (
      !window.confirm(
        `Are you sure you want to delete the message category with ID: ${id}?`
      )
    )
      return;
    deleteMsgCategoryMutation.mutate(id);
  };

  const handleShowModal = (params: HandleShowModalParams<MessageCategory>) => {
    dispatch(openModal());
    if (params?.type === "create") {
      dispatch(resetMessageCategoryState());

      return;
    }
    const { type, data } = params;
    if (type === "edit") dispatch(setEditingId(data._id));
    dispatch(setMessageCategoryState(getMessageCategoryStateDataHelper(data)));
  };
  return (
    <>
      <TableListWrapper
        theadChildren={
          <tr>
            <th>
              Actions
              <Button onClick={() => handleShowModal({ type: "create" })}>
                New
              </Button>
            </th>
            <th>
              <div>
                <SortByParamsButton buttonText="Name" sortBy="name" />
                <SortByParamsButton buttonText="Enabled" sortBy="enabled" />
                <SortByParamsButton buttonText="Uses" sortBy="uses" />
              </div>
            </th>
            <th>Messages</th>
          </tr>
        }
        tbodyChildren={data.map((category, index) => {
          const { tag, mood } = category;
          return (
            <tr key={index}>
              <td>
                <div>
                  <Button
                    onClick={() =>
                      handleShowModal({ type: "edit", data: category })
                    }
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() =>
                      handleShowModal({ type: "duplicate", data: category })
                    }
                  >
                    Duplicate
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteMessageCategory(category._id)}
                  >
                    Delete
                  </Button>
                </div>
              </td>
              <td>
                <TableDataWrapper>
                  <div>Name</div>
                  <div>{category.name}</div>
                  <div>Enabled</div>
                  {generateEnabledDisabledDiv(
                    category.enabled,
                    category.enabled.toString().toUpperCase()
                  )}
                  <div>Uses</div>
                  <div>{category.uses}</div>
                  <div>Tag:</div>
                  {generateEnabledDisabledDiv(tag.enabled, tag.name)}
                  <div>Mood:</div>
                  {generateEnabledDisabledDiv(mood.enabled, mood.name)}
                </TableDataWrapper>
              </td>
              <td>
                <TableItemsListWrapper>
                  {category.messages.map((message, index) => (
                    <div key={index}>
                      {message[0]} - uses: {message[1]}
                    </div>
                  ))}
                </TableItemsListWrapper>
              </td>
            </tr>
          );
        })}
      ></TableListWrapper>
    </>
  );
}
