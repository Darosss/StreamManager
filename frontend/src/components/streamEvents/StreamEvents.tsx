import { useState } from "react";
import { ResponsiveLayouts } from "react-grid-layout/legacy";

import StreamChat from "./streamChat";
import StreamChatters from "./streamChatters";
import StreamNotifications from "./streamNotifications";
import StreamStatistics from "./streamStatistics";
import MessagesWindow from "./messageWindow";
import {
  initialLayoutWidgets,
  initialToolboxWidgets,
  widgetsKeys,
} from "@layout";
import { useParams } from "react-router";
import { useEditWidget, useGetWidgetById } from "@services";
import StreamModes from "./streamModes";
import { getInitialCurrentBreakpoint } from "@utils";
import ReactGrid from "@components/reactGrid";
import MusicPlayer from "./musicPlayer";
import RewardsWindow from "./rewardsWindow";
import { CustomTitle } from "@components/componentWithTitle";
import { Error, Loading } from "@components/axiosHelper";
import { NOTIFICATION_TYPE, useNotifications } from "@contexts";

const components = new Map([
  [widgetsKeys.streamChat, StreamChat],
  [widgetsKeys.streamChatters, StreamChatters],
  [widgetsKeys.streamNotifications, StreamNotifications],
  [widgetsKeys.streamStatistics, StreamStatistics],
  [widgetsKeys.messagesWindow, MessagesWindow],
  [widgetsKeys.streamModes, StreamModes],
  [widgetsKeys.musicPlayer, MusicPlayer],
  [widgetsKeys.rewardsWindow, RewardsWindow],
]);

export default function StreamEvents(params: { editor?: boolean }) {
  const { editor = false } = params;
  const { eventsId } = useParams();
  const { addNotify } = useNotifications();
  const [currentBreakpoint, setCurrentBreakpoint] = useState(() =>
    getInitialCurrentBreakpoint(),
  );

  const updateWidgetMutation = useEditWidget();
  const {
    data: widgetData,
    isLoading,
    error,
  } = useGetWidgetById(eventsId || "");

  if (error) return <Error error={error} />;
  if (!widgetData || isLoading) return <Loading />;
  const handleUpdateWidget = (
    layoutState: ResponsiveLayouts,
    toolboxState: ResponsiveLayouts,
  ) => {
    if (!eventsId) {
      addNotify({
        title: "Couldn't update widget",
        message: "No widget id",
        type: NOTIFICATION_TYPE.WARNING,
      });
      return;
    }
    updateWidgetMutation.mutate({
      id: eventsId,
      updatedWidget: { layout: layoutState, toolbox: toolboxState },
    });
  };

  //so tahts for initial data, when widget data in backend does not have defaults somehow
  const { layout, toolbox } = widgetData.data || {
    layout: initialLayoutWidgets,
    toolbox: initialToolboxWidgets,
  };
  return (
    <div>
      <CustomTitle title={"Events " + widgetData.data.name} />
      <ReactGrid
        layoutName={widgetData.data.name}
        layoutState={{ ...layout }}
        toolboxState={{ ...toolbox }}
        currentBreakpointState={[currentBreakpoint, setCurrentBreakpoint]}
        componentsMap={components}
        onEdit={handleUpdateWidget}
        showMenu={editor}
      ></ReactGrid>
    </div>
  );
}
