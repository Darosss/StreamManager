import { Trigger, TriggerCreateData, useDeleteTrigger } from "@services";
import { DateTooltip } from "@components/dateTooltip";
import {
  TableDataWrapper,
  TableItemsListWrapper,
  TableListWrapper,
} from "@components/tableWrapper";
import SortByParamsButton from "@components/SortByParamsButton";
import {
  openModal,
  resetTriggerState,
  setEditingId,
  setTriggerState,
} from "@redux/triggersSlice";
import { useDispatch } from "react-redux";
import { HandleShowModalParams } from "@components/types";
import { Button } from "@components/ui";
import { StatusLabel } from "@components/common/StatusLabel";

interface TriggersDataProps {
  data: Trigger[];
}

const getTriggerStateDataHelper = (trigger: Trigger): TriggerCreateData => {
  return {
    ...trigger,
    tag: trigger.tag._id,
    mood: trigger.mood._id,
  };
};

export default function TriggersData({ data }: TriggersDataProps) {
  const dispatch = useDispatch();

  const deleteTriggerMutation = useDeleteTrigger();
  const handleDeleteTrigger = (id: string) => {
    if (
      !window.confirm(
        `Are you sure you want to delete the trigger with ID: ${id}?`
      )
    )
      return;
    deleteTriggerMutation.mutate(id);
  };
  const handleShowModal = (params: HandleShowModalParams<Trigger>) => {
    dispatch(openModal());
    if (params?.type === "create") {
      dispatch(resetTriggerState());

      return;
    }
    const { type, data } = params;
    if (type === "edit") dispatch(setEditingId(data._id));
    dispatch(setTriggerState(getTriggerStateDataHelper(data)));
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
            <th colSpan={5}>
              <div>
                <SortByParamsButton buttonText="Name" sortBy="name" />
                <SortByParamsButton buttonText="Enabled" sortBy="enabled" />
                <SortByParamsButton buttonText="Uses" sortBy="uses" />
                <SortByParamsButton buttonText="Delay" sortBy="delay" />
                <SortByParamsButton buttonText="Mode" sortBy="mode" />
                <SortByParamsButton
                  buttonText="Created at"
                  sortBy="createdAt"
                />
              </div>
            </th>
            <th>Words</th>
            <th>Messages</th>
          </tr>
        }
        tbodyChildren={data.map((trigger) => {
          const { tag, mood } = trigger;
          return (
            <tr key={trigger._id}>
              <td>
                <div>
                  <Button
                    onClick={() =>
                      handleShowModal({ type: "duplicate", data: trigger })
                    }
                  >
                    Duplicate
                  </Button>
                  <Button
                    onClick={() =>
                      handleShowModal({ type: "edit", data: trigger })
                    }
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteTrigger(trigger._id)}
                  >
                    Delete
                  </Button>
                </div>
              </td>
              <td colSpan={5}>
                <TableDataWrapper>
                  <div>Name: </div>
                  <div>{trigger.name}</div>
                  <div>Chance: </div>
                  <div>{trigger.chance}</div>
                  <div>Enabled: </div>
                  <StatusLabel enabled={trigger.enabled}>
                    {trigger.enabled.toString()}
                  </StatusLabel>
                  <div>Delay: </div>
                  <div>{trigger.delay}</div>
                  <div>Uses: </div>
                  <div>{trigger.uses}</div>
                  <div>Mode:</div>
                  <div>{trigger.mode}</div>
                  <div>Tag:</div>
                  <StatusLabel enabled={tag.enabled}>{tag.name}</StatusLabel>
                  <div>Mood:</div>
                  <StatusLabel enabled={mood.enabled}>{mood.name}</StatusLabel>
                  <div>Created at:</div>
                  <div>
                    <DateTooltip date={trigger.createdAt} />
                  </div>
                </TableDataWrapper>
              </td>
              <td>
                <TableItemsListWrapper>
                  {trigger.words.map((word, index) => {
                    return <div key={index}>{word}</div>;
                  })}
                </TableItemsListWrapper>
              </td>
              <td>
                <TableItemsListWrapper>
                  {trigger.messages.map((message, index) => {
                    return <div key={index}>{message}</div>;
                  })}
                </TableItemsListWrapper>
              </td>
              <td></td>
            </tr>
          );
        })}
      ></TableListWrapper>
    </>
  );
}
