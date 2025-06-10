import { useRef, useState } from "react";

import Player from "@/components/editor/player";
import Tools from "@/components/editor/tools";
import Timeline from "@/components/editor/timeline";
import Config from "@/components/editor/config";

export default function Main() {
  const playerRef = useRef(null);
  const playerOverlayRef = useRef(null);
  const configOverlayRef = useRef(null);

  const [configActive, setConfigActive] = useState({ key: "main" });

  return (
    <main className="flex h-[calc(100%-var(--header-height)-var(--layout-space))] flex-col space-y-[var(--layout-space)] rounded-[var(--layout-rounded)] px-[var(--layout-space)]">
      <div className="flex flex-1 space-x-[var(--layout-space)]">
        <Tools playerRef={playerRef} playerOverlayRef={playerOverlayRef} configOverlayRef={configOverlayRef} />
        <Player playerRef={playerRef} playerOverlayRef={playerOverlayRef} />
        <Config configActive={configActive} configOverlayRef={configOverlayRef} />
      </div>
      <Timeline playerRef={playerRef} setConfigActive={setConfigActive} />
    </main>
  );
}
