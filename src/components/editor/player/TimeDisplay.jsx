import { useCallback, useEffect, useRef, useState } from "react";

import formatTime from "@/utilities/format-time";
import useProjectData, { useDurationInFrames } from "@/store/projectData";

export default function TimeDisplay({ playerRef }) {
  const durationInFrames = useDurationInFrames();
  const fps = useProjectData(({ fps }) => fps);

  const progressRef = useRef(null);
  const [time, setTime] = useState(0);
  const [progressRatio, setProgressRatio] = useState(0);

  useEffect(() => {
    const current = playerRef.current;
    if (!current) return;
    const onTimeUpdate = () => {
      setTime(current.getCurrentFrame());
      setProgressRatio(((current.getCurrentFrame() / durationInFrames) * 100).toFixed(2));
    };
    current.addEventListener("frameupdate", onTimeUpdate);
    return () => current.removeEventListener("frameupdate", onTimeUpdate);
  }, [durationInFrames]);

  const handleClick = useCallback(
    ({ clientX }) => {
      const player = playerRef.current;
      const progress = progressRef.current;
      if (!player || !progress) return;
      const { left, width } = progress.getBoundingClientRect();
      const target = Math.floor(((clientX - left) / width) * durationInFrames);
      player.seekTo(target);
    },
    [durationInFrames],
  );

  return (
    <div className="flex items-center space-x-[var(--space-x)] px-[var(--space-x)] text-[var(--foreground-color)] [--space-x:0.5rem]">
      <div ref={progressRef} style={{ "--progress": progressRatio + "%" }} className="relative h-1 flex-1 cursor-pointer rounded-lg bg-[#2e333a] before:absolute before:top-0 before:left-0 before:h-full before:w-[var(--progress)] before:rounded-[inherit] before:bg-[var(--highlight-color)] before:content-['']" onClick={handleClick}></div>
      <span className="text-sm">
        {formatTime(time, fps)} / {formatTime(durationInFrames, fps)}
      </span>
    </div>
  );
}
