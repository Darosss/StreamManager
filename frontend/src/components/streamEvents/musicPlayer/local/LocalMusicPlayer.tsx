import { useState } from "react";
import AudioFolderCreate from "./AudioFolderCreate";
import AudioFoldersList from "./AudioFoldersList";
import UploadMp3Form from "./UploadMp3Form";
import Modal from "@components/modal";
import TabsButtons from "../TabsButtons";

enum AvailableTabs {
  UPLOAD = "upload",
  MUSIC = "music",
  FOLDERS = "folders",
  NONE = "none",
}

export default function LocalMusicPlayer() {
  const [activeTab, setActiveTab] = useState<AvailableTabs>(AvailableTabs.NONE);

  const generateMusicPlayerContext = () => {
    switch (activeTab) {
      case AvailableTabs.UPLOAD:
        return <UploadMp3Form />;
      case AvailableTabs.MUSIC:
        return <AudioFoldersList />;
      case AvailableTabs.FOLDERS:
        return <AudioFolderCreate />;
    }
  };

  return (
    <div>
      <div className="music-player-tabs-wrapper">
        <TabsButtons
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          possibleTabs={AvailableTabs}
        />
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
