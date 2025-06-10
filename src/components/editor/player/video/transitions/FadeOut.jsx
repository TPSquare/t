import { useContext, useMemo } from "react";
import { interpolate, useVideoConfig } from "remotion";

import VideoContext from "../VideoContext";

export default function FadeOut({ children, start, end, style, currentFrame }) {
  if (currentFrame < start || currentFrame > end) return null;
  const { reflexDuration } = useContext(VideoContext);
  const { fps } = useVideoConfig();
  const timing = useMemo(() => reflexDuration * fps, [reflexDuration, fps]);
  const fadeOut = interpolate(currentFrame, [end - timing / 2, end], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <div style={{ opacity: fadeOut, ...style }}>{children}</div>;
}
