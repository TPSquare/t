import { useEffect, useRef, useState } from "react";

export default function Container({ title = "", children }) {
  const [isActive, setIsActive] = useState(false);
  const containerRef = useRef();

  const toggle = (force) => setIsActive(force || !isActive);

  useEffect(() => {
    if (!isActive) return;
    const container = containerRef.current;
    if (!container) return;
    const handleClickOutside = ({ target }) => {
      if (!container.contains(target)) setIsActive(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isActive]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleOnClick = ({ target }) => {
      if (target.getAttribute("close-menu-on-click") === "true") setIsActive(false);
    };
    container.addEventListener("click", handleOnClick);
    return () => container.removeEventListener("click", handleOnClick);
  }, []);

  return (
    <div ref={containerRef} className="group relative text-sm text-[var(--foreground-color)]">
      <button className="rounded-md px-2 py-1 group-hover:bg-[#ffffff30]" style={{ backgroundColor: isActive ? "#ffffff30" : null }} type="button" title={title} onClick={() => toggle()}>
        {title}
      </button>
      <div className="absolute top-[110%] left-0 z-20 min-w-40 space-y-1.5 rounded-md border-[1.5px] border-[var(--layout-border-color)] bg-[var(--float-layout-background-color)] pt-1 pb-1.5" style={{ display: !isActive ? "none" : null }}>
        {children}
      </div>
    </div>
  );
}
