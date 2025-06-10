import { forwardRef, useImperativeHandle, useRef } from "react";

const Overlay = forwardRef(({ opacity }, ref) => {
  const overlayRef = useRef();
  useImperativeHandle(ref, () => ({
    show: () => overlayRef.current?.classList.remove("hidden"),
    hide: () => overlayRef.current?.classList.add("hidden"),
    toggle: () => overlayRef.current?.classList.toggle("hidden"),
  }));

  const style = { opacity };
  return <div ref={overlayRef} className="absolute top-0 left-0 z-50 hidden h-full w-full cursor-not-allowed rounded-[inherit] bg-[var(--overlay-background-color)]" style={style}></div>;
});

export default Overlay;
