import { useContext, useMemo, useRef, useEffect } from "react";

import useProjectData, { useDurationInFrames } from "@/store/projectData";
import Item from "./Item";
import TimelineContext from "../TimelineContext";

export default function ImageItem({ startFrame, imageData }) {
  const fps = useProjectData(({ fps }) => fps);
  const { convertFramesToPixels, convertPixelsToFrames } = useContext(TimelineContext);
  const durationInFrames = useDurationInFrames();

  const name = useMemo(() => {
    const filename = imageData.filename || "";
    const lastDot = filename.lastIndexOf(".");
    return lastDot !== -1 ? filename.substring(0, lastDot) : filename;
  }, [imageData.filename]);

  const canvasRef = useRef(null);
  const itemRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const item = itemRef.current;
    if (!canvas || !item || !imageData?.url) return;

    const ctx = canvas.getContext("2d");
    const thumbnailHeight = item.clientHeight;
    const thumbnailWidth = (thumbnailHeight * 16) / 9;

    const canvasWidth = convertFramesToPixels(durationInFrames);
    canvas.width = canvasWidth;
    canvas.height = thumbnailHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const image = new Image();
    image.src = imageData.url;

    let cancelled = false;

    const generateThumbnails = async () => {
      await new Promise((resolve) => (image.onload = () => resolve()));

      if (cancelled) return;

      const thumbDurationInFrames = convertPixelsToFrames(thumbnailWidth);
      const thumbCount = Math.ceil(durationInFrames / thumbDurationInFrames);

      for (let i = 0; i <= thumbCount; i++) {
        if (cancelled) return;
        const x = i * thumbnailWidth;
        ctx.drawImage(image, x, 0, thumbnailWidth, thumbnailHeight);
      }
    };

    generateThumbnails();
    return () => {
      cancelled = true;
    };
  }, [imageData, durationInFrames, fps, convertFramesToPixels, convertPixelsToFrames]);

  return (
    <Item ref={itemRef} type="image" name={name} startFrame={startFrame} durationInFrames={durationInFrames}>
      <canvas ref={canvasRef} className="absolute bottom-0" />
    </Item>
  );
}
