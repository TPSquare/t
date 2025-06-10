import { useEffect, useRef, useCallback, memo, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { useDurationInFrames } from "@/store/projectData";
import TimelineContext from "./TimelineContext";

export default function Playhead({ playerRef, timelineRef }) {
  const durationInFrames = useDurationInFrames();
  const { timelineWidth } = useContext(TimelineContext);

  const playheadRef = useRef(null);

  const onTimeUpdate = useCallback(() => {
    const player = playerRef.current;
    const timeline = timelineRef.current;
    const playhead = playheadRef.current;

    if (!player || !timeline || !playhead) return;

    const position = Number(((player.getCurrentFrame() / durationInFrames) * timelineWidth).toFixed(1));
    playhead.style.left = `${position}px`;

    const scrollLeft = timeline.scrollLeft;
    const clientWidth = timeline.clientWidth;
    const isMoveOut = position > scrollLeft + clientWidth || position < scrollLeft;

    if (isMoveOut) {
      const target = Math.max(0, position - clientWidth / 2);
      timeline.scrollTo({ left: target });
    }
  }, [durationInFrames, timelineWidth]);

  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;
    player.addEventListener("frameupdate", onTimeUpdate);
    return () => {
      player.removeEventListener("frameupdate", onTimeUpdate);
    };
  }, [onTimeUpdate]);

  return (
    <div ref={playheadRef} className="absolute z-20 h-full w-[1px] bg-[var(--playhead-color)]">
      <FontAwesomeIcon icon={fas.faCaretDown} className="absolute -top-[10px] left-[50%] -translate-x-[50%] transform text-2xl text-[var(--playhead-color)]" />
    </div>
  );
}
