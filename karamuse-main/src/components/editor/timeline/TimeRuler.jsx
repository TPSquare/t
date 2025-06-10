import { useCallback, useContext, useEffect, useRef, useState } from "react";
import formatTime from "@/utilities/format-time";
import TimelineContext from "./TimelineContext";
import useProjectData from "@/store/projectData";

export const TimeRulerHeader = () => {
  return <div className="h-8 w-full bg-[var(--timeline-ruler-background)]"></div>;
};

export const TimeRuler = ({ playerRef, timelineRef }) => {
  const { timelineWidth, convertFramesToPixels, convertPixelsToFrames } = useContext(TimelineContext);
  const fps = useProjectData(({ fps }) => fps);

  const timeRulerRef = useRef(null);

  const minDistance = 80;
  const lineConfig = { width: 1, tall: 10, short: 5 };
  const between = 5;
  const [lines, setLines] = useState([]);

  const generateTimeRuler = useCallback(() => {
    const timeRulerWidth = Math.max(timeRulerRef.current?.clientWidth, timelineWidth);
    const secondWidth = convertFramesToPixels(fps);
    const distance = Math.ceil(minDistance / secondWidth) * secondWidth;
    const frames = convertPixelsToFrames(distance);
    const numberDisplays = Math.ceil(timeRulerWidth / distance) + 1;

    const newLines = [];
    newLines.push({
      x: -lineConfig.width / 2,
      height: lineConfig.tall,
      time: formatTime(0, fps),
    });
    for (let i = 1; i < numberDisplays; i++) {
      for (let j = 1; j < between; j++) {
        const x = (i - 1) * distance + (j / between) * distance - lineConfig.width / 2;
        if (x <= timeRulerWidth) newLines.push({ x, height: lineConfig.short });
      }
      const x = i * distance - lineConfig.width / 2;
      if (x <= timeRulerWidth)
        newLines.push({
          x,
          height: lineConfig.tall,
          time: formatTime(i * frames, fps),
        });
    }
    setLines(newLines);
  }, [timelineWidth, fps, convertFramesToPixels, convertPixelsToFrames]);

  useEffect(() => {
    generateTimeRuler();
    window.addEventListener("resize", generateTimeRuler);
    return () => window.removeEventListener("resize", generateTimeRuler);
  }, [generateTimeRuler]);

  const [timelineClientLeft, setTimelineClientLeft] = useState(null);

  useEffect(() => {
    const styled = getComputedStyle(document.documentElement);
    const fontSize = Number(styled.fontSize.slice(0, -2));
    const space = Number(styled.getPropertyValue("--layout-space").trim().slice(0, -3));
    const leftWidth = Number(styled.getPropertyValue("--timeline-left-width").trim().slice(0, -3));
    setTimelineClientLeft((space + leftWidth) * fontSize);
  }, []);

  const onClick = useCallback(
    ({ clientX }) => {
      const player = playerRef.current;
      const timeline = timelineRef.current;
      if (!player || !timeline || timelineClientLeft === null) return;
      const position = timeline.scrollLeft + clientX - timelineClientLeft;
      const durationInFrames = convertPixelsToFrames(timelineWidth);
      const target = Math.floor((position / timelineWidth) * durationInFrames);
      player.seekTo(target);
    },
    [playerRef, timelineRef, timelineWidth, timelineClientLeft, convertPixelsToFrames],
  );

  return (
    <div ref={timeRulerRef} className="relative h-8 w-[var(--timeline-width)] min-w-full cursor-pointer bg-[var(--timeline-ruler-background)]" data-ignore-timeline-item-blur style={{ "--line-w": `${lineConfig.width}px` }} onClick={onClick}>
      {lines.map((config, i) => (
        <div key={i} className="absolute bottom-0 left-[var(--x)] h-[var(--h)] w-[var(--line-w)] bg-[var(--foreground-color)]" style={{ "--x": `${config.x}px`, "--h": `${config.height}px` }}>
          {config.time && <span className="absolute bottom-full left-[50%] -translate-x-[50%] transform text-xs text-[var(--foreground-color)]">{config.time}</span>}
        </div>
      ))}
    </div>
  );
};
