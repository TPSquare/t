import { useRef, useState } from "react";

import HeaderButton from "./HeaderButton";
import AudioPanel from "./panels/audio";
import LyricsPanel from "./panels/lyrics";
import RecordPanel from "./panels/record";
import BackgroundPanel from "./panels/background";
import Overlay from "@/components/Overlay";

export default function Tools({ playerRef, playerOverlayRef, configOverlayRef }) {
  const [activeKey, setActiveKey] = useState("");
  const toolsHeaderOverlayRef = useRef(null);

  const headerButtons = [
    { key: "audio", icon: "faMusic", text: "Audio" },
    { key: "background", icon: "faPhotoFilm", text: "Background" },
    { key: "lyrics", icon: "faQuoteLeft", text: "Lyrics" },
    { key: "record", icon: "faSquare", text: "Record" },
  ];

  return (
    <div className="flex-3 overflow-hidden rounded-[var(--layout-rounded)] bg-[var(--layout-background-color)]">
      <div className="scrollbar-none relative flex h-[var(--tools-header-height)] w-full items-center overflow-x-auto bg-[var(--layout-header-background-color)]">
        <Overlay ref={toolsHeaderOverlayRef} opacity={0.6} />
        {headerButtons.map(({ key, icon, text }) => (
          <HeaderButton key={key} buttonKey={key} icon={icon} subText={text} activeKey={activeKey} setActiveKey={setActiveKey} />
        ))}
      </div>
      <div className="h-[calc(100%-var(--tools-header-height))]">
        <AudioPanel panelKey="audio" activeKey={activeKey} />
        <BackgroundPanel panelKey="background" activeKey={activeKey} />
        <LyricsPanel panelKey="lyrics" activeKey={activeKey} />
        <RecordPanel panelKey="record" activeKey={activeKey} {...{ playerRef, playerOverlayRef, configOverlayRef, toolsHeaderOverlayRef }} />
      </div>
    </div>
  );
}
