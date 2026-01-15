import { useState } from "react";
import { useCreateWidget, useDeleteWidget, useGetWidgets } from "@services";
import { Link } from "react-router";
import { initialLayoutWidgets, initialToolboxWidgets } from "@layout";
import CardboxWrapper, { CardboxItem } from "@components/cardboxWrapper";
import { Error, Loading } from "@components/axiosHelper";
import { useQueryParams } from "@hooks/useQueryParams";
import { fetchWidgetsDefaultParams } from "@services";
import { Button } from "@components/ui";
import { NOTIFICATION_TYPE, useNotifications } from "@contexts";

export default function StreamNotifications() {
  const queryParams = useQueryParams(fetchWidgetsDefaultParams);

  const { addNotify } = useNotifications();
  const { data, isLoading, error } = useGetWidgets(queryParams);

  const [layoutName, setLayoutName] = useState<string>("");

  const createWidgetMutation = useCreateWidget();
  const deleteWidgetMutation = useDeleteWidget();

  if (error) return <Error error={error} />;
  if (!data || isLoading) return <Loading />;

  const { data: layouts } = data;

  const handleCreateWidget = () => {
    if (!layoutName)
      return addNotify({
        title: "Provide name",
        message: "You need to provide layout name",
        type: NOTIFICATION_TYPE.DANGER,
      });
    createWidgetMutation.mutate({
      name: layoutName,
      layout: initialLayoutWidgets,
      toolbox: initialToolboxWidgets,
    });
  };

  const handleDeleteWidget = (id: string) => {
    if (
      !window.confirm(
        `Are you sure you want to delete the widget with ID: ${id}?`
      )
    )
      return;
    deleteWidgetMutation.mutate(id);
  };

  return (
    <>
      <CardboxWrapper title={"Events widgets list"}>
        <CardboxItem title="Create widgets layout">
          <input
            type="text"
            placeholder="Name"
            value={layoutName}
            onChange={(e) => setLayoutName(e.target.value)}
          />
          <Button onClick={handleCreateWidget}>Create</Button>
        </CardboxItem>
        {layouts.map((layout, index) => (
          <CardboxItem
            title={layout.name}
            onClickX={() => {
              handleDeleteWidget(layout._id);
            }}
            key={index}
          >
            <Link className="common-button primary-button" to={`${layout._id}`}>
              Show
            </Link>
            <Link
              className="common-button primary-button"
              to={`${layout._id}/editor`}
            >
              Edit
            </Link>
          </CardboxItem>
        ))}
      </CardboxWrapper>
    </>
  );
}
