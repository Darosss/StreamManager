import { useEffect, useState } from "react";

import NavigateButton from "@components/navigateButton";
import { useGetConfigs } from "@services";
import CommandsConfigsWrapper from "./CommandsConfigs";
import TimersConfigsWrapper from "./TimersConfigs";
import ChatGamesConfigsWrapper from "./ChatGamesConfigs";
import TriggersConfigsWrapper from "./TriggersConfigs";
import PointsConfigsWrapper from "./PointsConfigs";
import LoyaltyConfigsWrapper from "./LoyaltyConfigs";
import MusicConfigsWrapper from "./MusicConfigs";
import HeadConfigsWrapper from "./HeadConfigs";
import EditConfigs from "./EditConfigs";
import Error from "@components/axiosHelper/errors";
import { Loading } from "@components/axiosHelper";
import { useAppDispatch } from "@redux";
import { setConfigState } from "@redux/configsSlice";
import { Button } from "@components/ui/button";

enum ConfigsListTabNames {
  HEAD = "Head options",
  COMMANDS = "Commands options",
  TIMERS = "Timers options",
  CHAT_GAMES = "Chat games options",
  TRIGGERS = "Triggers options",
  POINTS = "Points options",
  LOYALTY = "Loyalty options",
  MUSIC = "Music options",
}

export default function ConfigsList() {
  const dispatch = useAppDispatch();

  const [currentTab, setCurrentTab] = useState<ConfigsListTabNames>(
    ConfigsListTabNames.HEAD,
  );

  const { data: configs, isLoading, error } = useGetConfigs();
  useEffect(() => {
    if (!configs) return;
    dispatch(setConfigState(configs.data));
  }, [configs, dispatch]);

  if (error) return <Error error={error} />;
  if (isLoading || !configs) return <Loading />;

  const renderTabComponent = () => {
    switch (currentTab) {
      case ConfigsListTabNames.COMMANDS:
        return <CommandsConfigsWrapper />;
      case ConfigsListTabNames.TIMERS:
        return <TimersConfigsWrapper />;
      case ConfigsListTabNames.CHAT_GAMES:
        return <ChatGamesConfigsWrapper />;
      case ConfigsListTabNames.TRIGGERS:
        return <TriggersConfigsWrapper />;
      case ConfigsListTabNames.POINTS:
        return <PointsConfigsWrapper />;
      case ConfigsListTabNames.LOYALTY:
        return <LoyaltyConfigsWrapper />;
      case ConfigsListTabNames.MUSIC:
        return <MusicConfigsWrapper />;
      case ConfigsListTabNames.HEAD:
        return <HeadConfigsWrapper />;
    }
  };

  return (
    <div>
      <div className="base-header-wrapper">
        <NavigateButton />
        <EditConfigs />
      </div>

      <div className="configs-list-tab-list-wrapper">
        {Object.values(ConfigsListTabNames).map((tabName) => (
          <Button
            key={tabName}
            variant={currentTab === tabName ? "primary" : "danger"}
            onClick={() => setCurrentTab(tabName)}
          >
            {tabName}
          </Button>
        ))}
      </div>
      <div className="configs-list-wrapper">
        <div className="configs-section-wrapper">
          <div className="configs-section-header">{currentTab} </div>
          {renderTabComponent()}
        </div>
      </div>
    </div>
  );
}
