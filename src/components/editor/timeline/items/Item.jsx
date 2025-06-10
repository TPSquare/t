import { forwardRef, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import TimelineContext from "../TimelineContext";

const TYPE_COLORS = {
  audio: "--timeline-audio-rgb",
  lyric: "--timeline-lyric-rgb",
  video: "--timeline-video-rgb",
  image: "--timeline-image-rgb",
};

const Handles = ({ side = "", startFrame, durationInFrames, onResizeFrames, onResize }) => {
  const initialMouseXRef = useRef(null);
  const initialStateRef = useRef(null);
  const newFramesSizeRef = useRef(null);
  const hasMovedRef = useRef(null);

  const { convertPixelsToFrames, convertFramesToPixels } = useContext(TimelineContext);

  const handleResizeStart = (e) => {
    e.stopPropagation();
    hasMovedRef.current = false;
    initialMouseXRef.current = e.clientX;
    initialStateRef.current = { start: startFrame, duration: durationInFrames };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = useCallback(
    (e) => {
      const initialMouseX = initialMouseXRef.current;
      const initialState = initialStateRef.current;
      if (initialMouseX === null || !initialState) return;
      hasMovedRef.current = true;
      const deltaX = e.clientX - initialMouseX;
      const deltaFrame = convertPixelsToFrames(deltaX);
      const { start, duration } = (() => {
        if (side === "left")
          return {
            start: Math.max(0, initialState.start + deltaFrame),
            duration: Math.max(1, initialState.duration - deltaFrame),
          };
        return {
          start: initialState.start,
          duration: Math.max(1, initialState.duration + deltaFrame),
        };
      })();
      newFramesSizeRef.current = { start, duration };
      onResize(start, duration);
    },
    [convertPixelsToFrames],
  );

  const handleMouseUp = () => {
    if (hasMovedRef.current && newFramesSizeRef.current) {
      const { start, duration } = newFramesSizeRef.current;
      onResizeFrames(start, duration);
    }
    newFramesSizeRef.current = null;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  useEffect(() => () => handleMouseUp(), []);

  const style = (() => {
    if (side === "left") return { left: convertFramesToPixels(startFrame) };
    else return { left: convertFramesToPixels(startFrame + durationInFrames), transform: "translateX(-100%)" };
  })();
  return <div className="absolute top-0 z-10 h-full w-1 cursor-ew-resize" onMouseDown={handleResizeStart} style={style}></div>;
};

const Item = forwardRef(({ startFrame, durationInFrames, name = "", type, children, onClick, onResizeFrames, onResize, attributes = {} }, ref) => {
  const { convertFramesToPixels, setConfigActive } = useContext(TimelineContext);
  const internalRef = useRef();

  const itemStyle = (() => {
    if (type === "lyrics-wrapper")
      return {
        backgroundColor: "transparent",
        border: "0.1rem dotted #ffffff50",
        height: "100%",
        top: "0",
      };

    const colorVar = TYPE_COLORS[type];
    const baseStyle = {
      backgroundColor: `rgba(var(${colorVar}), 0.6)`,
      border: `0.1rem solid rgb(var(${colorVar}))`,
      height: "100%",
      top: "0",
    };

    if (type === "lyric") {
      baseStyle.height = "80%";
      baseStyle.top = "10%";
    }

    return baseStyle;
  })();

  const [positionStyle, setPositionStyle] = useState();
  const updatePositionStyle = (startFrame, durationInFrames) =>
    setPositionStyle({
      left: `${convertFramesToPixels(startFrame)}px`,
      width: `${convertFramesToPixels(durationInFrames)}px`,
    });
  useEffect(() => updatePositionStyle(startFrame, durationInFrames), [startFrame, durationInFrames, convertFramesToPixels]);

  const handleResize = (newStart, newDuration) => {
    updatePositionStyle(newStart, newDuration);
    onResize?.(newStart, newDuration);
  };

  const handleBlurOnClick = ({ target }) => {
    const shouldBlur = target !== internalRef.current && !target.closest("[data-ignore-timeline-item-blur]");
    if (!shouldBlur) return;
    setConfigActive({ key: "main" });
    internalRef.current?.classList.remove("timeline-item-focused");
    document.removeEventListener("click", handleBlurOnClick);
  };
  const handleClick = ({ target }) => {
    if (!onClick || target !== internalRef.current || internalRef.current?.classList.contains("timeline-item-focused")) return;
    onClick();
    internalRef.current?.classList.add("timeline-item-focused");
    document.addEventListener("click", handleBlurOnClick);
  };

  const setRefs = (el) => {
    if (ref) ref.current = el;
    internalRef.current = el;
  };
  return (
    <>
      <div ref={setRefs} className="absolute overflow-hidden rounded-lg" {...attributes} style={{ ...itemStyle, ...positionStyle, cursor: onClick ? "pointer" : "default" }} onClick={handleClick}>
        {children}
        <span className="absolute top-1 left-2 overflow-hidden text-xs whitespace-nowrap text-[var(--foreground-color)] text-shadow-[0.5px_1px_0.5px_rgba(0,0,0,0.3)]">{name}</span>
      </div>
      {onResizeFrames && <Handles side="left" startFrame={startFrame} durationInFrames={durationInFrames} onResizeFrames={onResizeFrames} onResize={handleResize} />}
      {onResizeFrames && <Handles side="right" startFrame={startFrame} durationInFrames={durationInFrames} onResizeFrames={onResizeFrames} onResize={handleResize} />}
    </>
  );
});

export default Item;
