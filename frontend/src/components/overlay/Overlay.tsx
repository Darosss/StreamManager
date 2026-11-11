import { useEffect, useState } from "react";
import Redemptions from "./redemptions";
import { overlaysKeys } from "@layout";
import { getInitialCurrentBreakpoint } from "@utils";
import ReactGrid from "@components/reactGrid";
import MusicPlayer from "./musicPlayer";
import { CustomTitle } from "@components/componentWithTitle";
import Achievements from "./achievements";
import Chat from "./chat";
import PreviewImageSelector from "./PreviewImageSelector";
import StyleCSSEditor from "./StyleCSSEditor";
import { useSocketContext } from "@socket";
import {
  Overlay as OverlayType,
  useEditOverlay,
  useGetOverlayById,
  useRefetchOverlayById,
} from "@services";
import { useAppDispatch, useAppSelector } from "@redux";
import {
  setId,
  setIsEditor,
  setLayout,
  setOverlayState,
  setToolbox,
} from "@redux/overlaysSlice";

import { useParams } from "react-router";
import { Error, Loading } from "@components/axiosHelper";
import { NOTIFICATION_TYPE, useNotifications } from "@contexts";
import { ResponsiveLayouts } from "react-grid-layout";

const components = new Map([
  [overlaysKeys.overlayRedemptions, Redemptions],
  [overlaysKeys.overlayMusicPlayer, MusicPlayer],
  [overlaysKeys.overlayAchievements, Achievements],
  [overlaysKeys.overlayChat, Chat],
]);

export default function Overlay(params: { editor?: boolean }) {
  const { editor = false } = params;
  const { overlayId } = useParams();
  const { addNotify } = useNotifications();
  const {
    events: { refreshOverlayLayout: refreshOverlayLayoutEvent },
  } = useSocketContext();
  const dispatch = useAppDispatch();

  const overlaysStateRedux = useAppSelector((state) => state.overlays);
  const { isEditor, overlay: overlayState } = overlaysStateRedux;

  const [currentBreakpoint, setCurrentBreakpoint] = useState(() =>
    getInitialCurrentBreakpoint(),
  );
  const editOverlayMutation = useEditOverlay();

  //Note: Overlay is in route where overlayId should be.
  const { data: overlayData, isLoading, error } = useGetOverlayById(overlayId!);
  const refetchOverlayById = useRefetchOverlayById();

  useEffect(() => {
    if (!overlayId) {
      addNotify({
        title: "No overlay id",
        message: "Something went wrong, no overlay id",
        type: NOTIFICATION_TYPE.WARNING,
      });
      return;
    }
    dispatch(setId(overlayId));
  }, [addNotify, dispatch, overlayId]);

  useEffect(() => {
    dispatch(setIsEditor(editor));
  }, [dispatch, editor]);

  useEffect(() => {
    refreshOverlayLayoutEvent.on((id) => {
      refetchOverlayById(id);
    });

    return () => {
      refreshOverlayLayoutEvent.off();
    };
  }, [refetchOverlayById, refreshOverlayLayoutEvent]);

  useEffect(() => {
    if (!overlayData) return;

    dispatch(setOverlayState(overlayData.data));

    dispatch(setId(overlayData.data._id));
  }, [overlayData, dispatch]);

  if (error) return <Error error={error} />;
  if (isLoading || !overlayData) return <Loading />;

  const handleOnEditOverlay = (
    layoutState: ResponsiveLayouts,
    toolboxState: ResponsiveLayouts,
  ) => {
    if (!overlayId) {
      addNotify({
        title: "Couldn't update overlay",
        message: "No overlay id",
        type: NOTIFICATION_TYPE.WARNING,
      });
      return;
    }

    const filteredLayout: OverlayType["layout"] = {};
    for (const [key, layoutItem] of Object.entries(layoutState)) {
      if (!layoutItem) continue;

      filteredLayout[key] = [...layoutItem];
    }
    const filteredToolbox: OverlayType["toolbox"] = {};
    for (const [key, toolboxItem] of Object.entries(toolboxState)) {
      if (!toolboxItem) continue;

      filteredToolbox[key] = [...toolboxItem];
    }
    dispatch(setLayout(filteredLayout));
    dispatch(setToolbox(filteredToolbox));
    editOverlayMutation.mutate({
      id: overlayId,
      updatedOverlay: {
        layout: filteredLayout,
        toolbox: filteredToolbox,
      },
    });
  };
  //so tahts for initial data, when widget data in backend does not have defaults somehow
  // and cuz of force rerender when overlayData changes.

  const { layout, toolbox, name } = overlayData.data || {
    layout: overlayState.layout,
    toolbox: overlayState.toolbox,
    name: overlayState.name,
  };
  return (
    <div>
      <CustomTitle title={"Overlay " + name} />
      {editor ? (
        <div className="overlay-editor-actions-wrapper">
          <StyleCSSEditor />
          <PreviewImageSelector />
        </div>
      ) : null}
      <ReactGrid
        layoutName={name}
        layoutState={layout}
        toolboxState={toolbox}
        currentBreakpointState={[currentBreakpoint, setCurrentBreakpoint]}
        componentsMap={components}
        onEdit={handleOnEditOverlay}
        showMenu={isEditor}
      />
    </div>
  );
}
