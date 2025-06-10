import { useEffect } from "react";

import Overlay from "@/components/Overlay";
import Main from "./main";
import Lyrics from "./lyrics";
import ConfigContext from "./ConfigContext";

const valuableKeys = ["main", "lyrics"];

export default function Config({ configActive, configOverlayRef }) {
  if (process.env.NODE_ENV === "development")
    useEffect(() => {
      if (!valuableKeys.includes(configActive.key)) console.error(`${configActive.key} is not defined!`);
    }, [configActive]);
  return (
    <ConfigContext.Provider value={configActive}>
      <div className="relative flex-2 overflow-hidden rounded-[var(--layout-rounded)] bg-[var(--brighter-layout-background-color)]" data-ignore-timeline-item-blur>
        <Overlay ref={configOverlayRef} opacity={0.6} />
        <Main wrapperKey="main" />
        <Lyrics wrapperKey="lyrics" />
      </div>
    </ConfigContext.Provider>
  );
}
