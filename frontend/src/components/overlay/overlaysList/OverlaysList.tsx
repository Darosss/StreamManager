import { useState } from "react";
import { Link } from "react-router";
import {
  fetchOverlaysDefaultParams,
  useCreateOverlay,
  useDeleteOverlay,
  useGetOverlays,
} from "@services";
import CardboxWrapper, { CardboxItem } from "@components/cardboxWrapper";
import { Error, Loading } from "@components/axiosHelper";
import { useQueryParams } from "@hooks/useQueryParams";
import { initialLayoutOverlays, initialToolboxOverlays } from "@layout";
import { Button } from "@components/ui";
import { NOTIFICATION_TYPE, useNotifications } from "@contexts";

export default function OverlaysList() {
  const queryParams = useQueryParams(fetchOverlaysDefaultParams);
  const { addNotify } = useNotifications();
  const { data, isLoading, error } = useGetOverlays(queryParams);

  const [overlayName, setLayoutName] = useState<string>("");

  const createOverlayMutation = useCreateOverlay();
  const deleteOverlayMutation = useDeleteOverlay();

  if (error) return <Error error={error} />;
  if (!data || isLoading) return <Loading />;

  const { data: overlays } = data;

  const handleCreateOverlay = () => {
    if (!overlayName)
      return addNotify({
        title: "Provide name",
        message: "You need to provide overlay name",
        type: NOTIFICATION_TYPE.DANGER,
      });
    createOverlayMutation.mutate({
      name: overlayName,
      layout: initialLayoutOverlays,
      toolbox: initialToolboxOverlays,
    });
  };
  const handleDeleteOverlay = (id: string) => {
    if (
      !window.confirm(
        `Are you sure you want to delete the overlay with ID: ${id}?`
      )
    )
      return;
    deleteOverlayMutation.mutate(id);
  };

  return (
    <>
      <CardboxWrapper title={"Overlays list"}>
        <CardboxItem title="Create overlay">
          <input
            type="text"
            placeholder="Name"
            value={overlayName}
            onChange={(e) => setLayoutName(e.target.value)}
          />
          <Button onClick={handleCreateOverlay}>Create</Button>
        </CardboxItem>
        {overlays.map((overlay, index) => (
          <CardboxItem
            title={overlay.name}
            onClickX={() => {
              handleDeleteOverlay(overlay._id);
            }}
            key={index}
          >
            <Link
              className="common-button primary-button"
              to={`${overlay._id}`}
            >
              Show
            </Link>
            <Link
              className="common-button primary-button"
              to={`${overlay._id}/editor`}
            >
              Edit
            </Link>
          </CardboxItem>
        ))}
      </CardboxWrapper>
    </>
  );
}
