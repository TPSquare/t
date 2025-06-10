import { useContext } from "react";
import { useVideoConfig } from "remotion";

import VideoContext from "./VideoContext";
import generateTextShadow from "../../../../utilities/generate-text-shadow";
import FadeOut from "./transitions/FadeOut";
import AppearInOut from "./transitions/AppearInOut";

const Icon = ({ start, end, children, currentFrame }) => {
  return (
    <FadeOut start={start} end={end} style={{ marginRight: "0.2em" }} currentFrame={currentFrame}>
      {children}
    </FadeOut>
  );
};

export default function Countdown({ start, firstWordStart, currentFrame }) {
  const { countdown } = useContext(VideoContext);
  const { fps } = useVideoConfig();
  const iconDuration = (countdown.duration / countdown.quantity) * fps;
  const end = firstWordStart - iconDuration / 2;
  return (
    <AppearInOut start={start} end={end} style={{ position: "absolute", display: "flex", bottom: "100%", left: "0", fontSize: "0.8em", textShadow: generateTextShadow(0.08, countdown.outlineColor) }} currentFrame={currentFrame}>
      {Array.from({ length: countdown.quantity }, (_, i) => (
        <Icon key={i} start={start} end={end - iconDuration * i} currentFrame={currentFrame}>
          {countdown.icon}
        </Icon>
      ))}
    </AppearInOut>
  );
}
