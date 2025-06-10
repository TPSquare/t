import { AbsoluteFill, Audio, Img, Loop, OffthreadVideo, useCurrentFrame, useVideoConfig } from "remotion";
import seedrandom from "seedrandom";

import LyricsComponents from "./LyricsComponents";
import VideoContext from "./VideoContext";
import Watermark from "./Watermark";
import "../../../../styles/fonts.css";

export default function Video({ seed, videoBackgroundColor, classifiedLyrics, lyricsStyle, reflexDuration, video, audio, image, countdown }) {
  const { height, fps } = useVideoConfig();
  const currentFrame = useCurrentFrame();
  const random = seedrandom(String(seed));

  return (
    <VideoContext.Provider value={{ lyricsStyle, countdown, reflexDuration, random }}>
      <AbsoluteFill style={{ backgroundColor: videoBackgroundColor, fontSize: `${height / 100}px` }}>
        {video?.url && (
          <Loop durationInFrames={video.duration * fps}>
            <OffthreadVideo src={video.url} muted />
          </Loop>
        )}
        {image?.url && <Img src={image.url} />}
        {audio?.url && <Audio src={audio.url} />}
        <Watermark currentFrame={currentFrame} />
        <LyricsComponents classifiedLyrics={classifiedLyrics} currentFrame={currentFrame} />
      </AbsoluteFill>
    </VideoContext.Provider>
  );
}
