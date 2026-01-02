import { useState } from "react";
import YTPlaylist from "./YTPlaylist";
import Modal from "@components/modal";
import { Button } from "@components/ui";

enum AvailableTabs {
  PLAYLISTS = "playlists",
  NONE = "none",
}

export default function YTMusicPlayer() {
  const [activeTab, setActiveTab] = useState<AvailableTabs>(AvailableTabs.NONE);

  const generateMusicPlayerContext = () => {
    switch (activeTab) {
      case AvailableTabs.PLAYLISTS:
        return <YTPlaylist />;
    }
  };

  const TabsButtons = () =>
    Object.values(AvailableTabs).map((tab) =>
      tab !== AvailableTabs.NONE ? (
        <Button
          key={tab}
          variant={activeTab === tab ? "primary" : "tertiary"}
          className="switch-players-button"
          onClick={() => setActiveTab(tab)}
        >
          {tab}
        </Button>
      ) : null
    );

  return (
    <div>
      <div className="music-player-tabs-wrapper">
        <TabsButtons />
      </div>
      <Modal
        title={activeTab}
        onClose={() => setActiveTab(AvailableTabs.NONE)}
        onSubmit={() => setActiveTab(AvailableTabs.NONE)}
        show={activeTab !== AvailableTabs.NONE}
      >
        {generateMusicPlayerContext()}
      </Modal>
    </div>
  );
}
