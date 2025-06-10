import { useEffect, useRef, useCallback } from "react";

export const ScrollbarHorizontal = ({ timelineRef, timelineWidth }) => {
  const thumbRef = useRef(null);
  const trackRef = useRef(null);

  const onScroll = useCallback(() => {
    const timeline = timelineRef.current;
    const thumb = thumbRef.current;
    if (!timeline || !thumb) return;

    const fullScrollWidth = Math.max(timelineWidth, timeline.clientWidth);
    const left = ((timeline.scrollLeft / fullScrollWidth) * 100).toFixed(2);
    thumb.style.left = `${left}%`;
  }, [timelineRef, timelineWidth]);

  const setWidth = useCallback(() => {
    const timeline = timelineRef.current;
    const thumb = thumbRef.current;
    const track = trackRef.current;
    if (!timeline || !thumb || !track) return;

    const fullScrollWidth = Math.max(timelineWidth, timeline.clientWidth);
    const thumbSize = ((timeline.clientWidth / fullScrollWidth) * 100).toFixed(2);
    thumb.style.width = `${thumbSize}%`;

    if (thumbSize === "100") track.style.display = "none";
    else track.style.display = "block";
  }, [timelineRef, timelineWidth]);

  useEffect(() => {
    const timeline = timelineRef.current;
    if (!timeline) return;

    setWidth();
    timeline.addEventListener("scroll", onScroll);
    window.addEventListener("resize", setWidth);

    return () => {
      timeline.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", setWidth);
    };
  }, [timelineRef, onScroll, setWidth]);

  return (
    <div ref={trackRef} className="element-scrollbar-horizontal">
      <div ref={thumbRef}></div>
    </div>
  );
};
