import { useContext, useEffect, useMemo, useRef } from "react";
import Item from "./Item";
import useProjectData, { useDurationInFrames } from "@/store/projectData";
import TimelineContext from "../TimelineContext";

export default function VideoItem({ startFrame, videoData }) {
  const fps = useProjectData(({ fps }) => fps);
  const durationInFrames = useDurationInFrames();
  const { convertFramesToPixels, convertPixelsToFrames } = useContext(TimelineContext);

  const name = useMemo(() => {
    const filename = videoData.filename || "";
    const lastDot = filename.lastIndexOf(".");
    return lastDot !== -1 ? filename.substring(0, lastDot) : filename;
  }, [videoData.filename]);

  const canvasRef = useRef(null);
  const itemRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const item = itemRef.current;
    if (!canvas || !item || !videoData?.url) return;

    const ctx = canvas.getContext("2d");
    const thumbnailHeight = item.clientHeight;
    const thumbnailWidth = (thumbnailHeight * 16) / 9;

    canvas.width = convertFramesToPixels(durationInFrames);
    canvas.height = thumbnailHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const video = document.createElement("video");
    video.crossOrigin = "anonymous";
    video.preload = "auto";
    video.muted = true;
    video.src = videoData.url;

    let cancelled = false;

    const generateThumbnails = async () => {
      await new Promise((resolve) => (video.onloadeddata = () => resolve()));

      if (cancelled) return;

      const thumbDurationInFrames = convertPixelsToFrames(thumbnailWidth);
      const thumbCount = Math.ceil(durationInFrames / thumbDurationInFrames);
      const thumbDurationInSec = thumbDurationInFrames / fps;
      const halfDurationInSec = thumbDurationInSec / 2;

      for (let i = 0; i <= thumbCount; i++) {
        if (cancelled) return;
        await new Promise((resolve) => {
          const targetTime = (i * thumbDurationInSec + halfDurationInSec) % videoData.duration;
          video.currentTime = targetTime;

          video.onseeked = () => {
            const x = i * thumbnailWidth;
            ctx.drawImage(video, x, 0, thumbnailWidth, thumbnailHeight);
            resolve();
          };
        });
      }
    };

    generateThumbnails();
    return () => {
      cancelled = true;
    };
  }, [videoData, durationInFrames, convertFramesToPixels, convertPixelsToFrames]);

  return (
    <Item ref={itemRef} type="video" name={name} startFrame={startFrame} durationInFrames={durationInFrames}>
      <canvas ref={canvasRef} className="absolute bottom-0" />
    </Item>
  );
}
