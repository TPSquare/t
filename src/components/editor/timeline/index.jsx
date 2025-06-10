import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { TrackHeader, TimelineRow } from "./Track";
import AudioItem from "./items/AudioItem";
import VideoItem from "./items/VideoItem";
import LyricItemsWrapper from "./items/LyricItemsWrapper";
import Playhead from "./Playhead";
import { TimeRulerHeader, TimeRuler } from "./TimeRuler";
import { ScrollbarHorizontal } from "./Scrollbar";
import useProjectData, { useDurationInFrames } from "@/store/projectData";
import TimelineContext from "./TimelineContext";
import ImageItem from "./items/ImageItem";

const useLyricsTimelines = () => {
  const classifiedLyricsData = useProjectData(({ classifiedLyrics }) => classifiedLyrics);
  return useMemo(() => {
    return classifiedLyricsData.map((row, index) => {
      const children = row.map(({ lyrics, timing, start, end, index }, idx) => {
        const words = lyrics.split(" ").map((text, i) => {
          const { start, end } = timing[i];
          return { text, start, end };
        });
        return <LyricItemsWrapper key={idx} startFrame={start} endFrame={end} wordsData={words} lyricsIndex={index} />;
      });

      return {
        header: <TrackHeader key={index} type="lyrics" name={`Lyrics ${index + 1}`} />,
        row: <TimelineRow key={index}>{children}</TimelineRow>,
      };
    });
  }, [classifiedLyricsData]);
};

export default function Timeline({ playerRef, setConfigActive }) {
  const durationInFrames = useDurationInFrames();
  const videoData = useProjectData(({ video }) => video);
  const audioData = useProjectData(({ audio }) => audio);
  const imageData = useProjectData(({ image }) => image);

  const timelineRef = useRef(null);
  const tracksHeaderRef = useRef(null);
  const tracksRowRef = useRef(null);

  const [timelineZoom, setTimelineZoom] = useState(2);

  const frameConversion = 1;
  const convertFramesToPixels = useCallback((frame) => frame * timelineZoom * frameConversion, [timelineZoom]);
  const convertPixelsToFrames = useCallback((width) => Math.floor(width / timelineZoom / frameConversion), [timelineZoom]);

  const timelineWidth = useMemo(() => convertFramesToPixels(durationInFrames), [convertFramesToPixels, durationInFrames]);

  const lyricsTimelines = useLyricsTimelines();

  useEffect(() => {
    const headers = tracksHeaderRef.current;
    const rows = tracksRowRef.current;
    if (!headers || !rows) return;

    const headersScroll = () => (rows.scrollTop = headers.scrollTop);
    const rowsScroll = () => (headers.scrollTop = rows.scrollTop);

    headers.addEventListener("scroll", headersScroll);
    rows.addEventListener("scroll", rowsScroll);
    return () => {
      headers.removeEventListener("scroll", headersScroll);
      rows.removeEventListener("scroll", rowsScroll);
    };
  }, []);

  return (
    <TimelineContext.Provider value={{ timelineWidth, convertFramesToPixels, convertPixelsToFrames, setConfigActive }}>
      <div className="flex h-[35%] rounded-[var(--layout-rounded)] bg-[var(--layout-background-color)]" style={{ "--timeline-width": `${timelineWidth}px` }}>
        <div className="flex w-[var(--timeline-left-width)] flex-col overflow-hidden rounded-[var(--layout-rounded)] rounded-r-none">
          <div className="mb-1 h-[var(--timeline-fixed-y-height)]">
            <TimeRulerHeader />
          </div>
          <div ref={tracksHeaderRef} className="scrollbar-none space-y-1 overflow-x-hidden overflow-y-auto">
            {lyricsTimelines.map(({ header }) => header)}
            {videoData.url && <TrackHeader type="video" name="Background video" />}
            {imageData.url && <TrackHeader type="image" name="Background image" />}
            {audioData.url && <TrackHeader type="audio" name="Audio" />}
            <div className="h-10"></div>
          </div>
        </div>

        <div ref={timelineRef} className="scrollbar-none relative flex w-[calc(100%-var(--timeline-left-width))] flex-col overflow-x-auto rounded-[var(--layout-rounded)] rounded-l-none">
          <Playhead playerRef={playerRef} timelineRef={timelineRef} />
          <div className="mb-1 h-[var(--timeline-fixed-y-height)]">
            <TimeRuler playerRef={playerRef} timelineRef={timelineRef} />
          </div>
          <div ref={tracksRowRef} className="scrollbar-none w-[var(--timeline-width)] min-w-full space-y-1 overflow-x-hidden overflow-y-auto">
            {lyricsTimelines.map(({ row }) => row)}
            {videoData.url && (
              <TimelineRow>
                <VideoItem startFrame={0} videoData={videoData} />
              </TimelineRow>
            )}
            {imageData.url && (
              <TimelineRow>
                <ImageItem startFrame={0} imageData={imageData} />
              </TimelineRow>
            )}
            {audioData.url && (
              <TimelineRow>
                <AudioItem startFrame={0} audioData={audioData} />
              </TimelineRow>
            )}
            <div className="h-10"></div>
          </div>
        </div>

        <div className="fixed right-[var(--layout-space)] bottom-0 left-[var(--layout-space)] z-10 bg-[var(--scrollbar-track-color)] pl-[var(--timeline-left-width)]">
          <ScrollbarHorizontal timelineRef={timelineRef} timelineWidth={timelineWidth} />
        </div>
      </div>
    </TimelineContext.Provider>
  );
}
