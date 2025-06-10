import { useEffect, useState, useRef } from "react";
import { Player as RemotionPlayer } from "@remotion/player";

import PlayPauseButton from "./PlayPauseButton";
import FullscreenButton from "./FullscreenButton";
import TimeDisplay from "./TimeDisplay";
import Overlay from "@/components/Overlay";
import Video from "./video";
import useProjectData, { useDurationInFrames, useVideoInputProps } from "@/store/projectData";

export default function Player({ playerRef, playerOverlayRef }) {
  const fps = useProjectData(({ fps }) => fps);
  const durationInFrames = useDurationInFrames();

  const playerContainerRef = useRef(null);
  const playerWrapperRef = useRef(null);
  const controlRef = useRef(null);

  const initialPlayerSize = { width: 1, height: 1, initial: true };
  const [playerSize, setPlayerSize] = useState(initialPlayerSize);
  const resetPlayerSize = () => setPlayerSize(initialPlayerSize);

  useEffect(() => {
    const current = playerWrapperRef.current;
    if (!current) return;

    const toggleAbsolute = () => controlRef.current?.classList.toggle("absolute", Boolean(document.fullscreenElement));
    current.addEventListener("fullscreenchange", toggleAbsolute);

    current.addEventListener("resize", resetPlayerSize);
    window.addEventListener("resize", resetPlayerSize);

    const pauseOnBlur = () => playerRef.current.pause();
    window.addEventListener("blur", pauseOnBlur);
    return () => {
      current.removeEventListener("resize", resetPlayerSize);
      current.removeEventListener("fullscreenchange", toggleAbsolute);
      window.removeEventListener("resize", resetPlayerSize);
      window.removeEventListener("blur", pauseOnBlur);
    };
  }, []);

  const calculatePlayerSize = () => {
    const container = document.fullscreenElement ? playerWrapperRef.current : playerContainerRef.current;
    const control = controlRef.current;
    if (!container || !control) return;
    if (document.fullscreenElement) {
      const width = Math.floor(Math.min(container.clientWidth, (container.clientHeight * 16) / 9));
      const height = Math.floor((width * 9) / 16);
      return { width, height };
    }
    const availableHeight = container.clientHeight - control.clientHeight - 4; // space-y
    const width = container.clientWidth;
    let finalWidth;
    if ((width * 9) / 16 <= availableHeight) finalWidth = width;
    else finalWidth = (availableHeight * 16) / 9;
    finalWidth = Math.floor(finalWidth);
    const finalHeight = Math.floor((finalWidth * 9) / 16);
    return { width: finalWidth, height: finalHeight };
  };

  useEffect(() => {
    if (!playerSize.initial) return;
    const size = calculatePlayerSize();
    if (size) setPlayerSize(size);
  }, [playerSize]);

  return (
    <div ref={playerContainerRef} className="relative flex flex-3 items-center rounded-[var(--layout-rounded)] bg-[var(--layout-background-color)]">
      <Overlay ref={playerOverlayRef} opacity={0.6} />
      <div ref={playerWrapperRef} className="relative flex w-full flex-col items-center justify-center">
        <RemotionPlayer ref={playerRef} component={Video} inputProps={useVideoInputProps()} durationInFrames={durationInFrames} fps={fps} compositionWidth={playerSize.width} compositionHeight={playerSize.height} acknowledgeRemotionLicense spaceKeyToPlayOrPause />
        <div ref={controlRef} className="right-0 bottom-0 left-0 mt-1 w-full space-y-1 bg-[var(--layout-background-color)] pb-2">
          <TimeDisplay playerRef={playerRef}></TimeDisplay>
          <div className="flex justify-between px-[var(--space-x)] [--space-x:0.5rem]">
            <div className="space-x-[var(--space-x)]">
              <PlayPauseButton playerRef={playerRef} />
            </div>
            <div className="space-x-[var(--space-x)]">
              <FullscreenButton playerWrapperRef={playerWrapperRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
