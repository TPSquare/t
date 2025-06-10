import { forwardRef, useContext } from "react";

import ConfigContext from "./ConfigContext";

export const Wrapper = forwardRef(({ children, wrapperKey }, ref) => {
  const { key: activeKey } = useContext(ConfigContext);
  return (
    <div ref={ref} className={`flex h-full w-full flex-col ${activeKey !== wrapperKey ? "hidden" : ""}`}>
      {children}
    </div>
  );
});

export const Header = ({ children }) => {
  return (
    <div className="scrollbar-none h-10 w-full overflow-x-auto bg-[var(--layout-header-background-color)] pt-2">
      <div className="flex h-full">{children}</div>
    </div>
  );
};

export const HeaderButton = ({ title, buttonKey, activeKey, setActiveKey }) => {
  const isActive = buttonKey === activeKey;
  const bgcolor = isActive ? "var(--brighter-layout-background-color)" : "transparent";
  const textColor = isActive ? "var(--highlight-color)" : "var(--foreground-color)";
  const fontWeight = isActive ? 500 : "normal";

  const onClick = () => setActiveKey(buttonKey);

  return (
    <button className="relative h-full px-2" type="button" title={title} onClick={onClick} style={{ "--bgcolor": bgcolor, color: textColor, fontWeight }}>
      <span className="absolute bottom-0 left-0 block aspect-square h-2 bg-[var(--bgcolor)] before:block before:h-full before:w-full before:rounded-br-xl before:bg-[var(--layout-header-background-color)] before:content-['']"></span>
      <span className="flex h-full items-center rounded-t-lg bg-[var(--bgcolor)] px-2 text-sm whitespace-nowrap text-[inherit]">{title}</span>
      <span className="absolute right-0 bottom-0 block aspect-square h-2 bg-[var(--bgcolor)] before:block before:h-full before:w-full before:rounded-bl-xl before:bg-[var(--layout-header-background-color)] before:content-['']"></span>
    </button>
  );
};

export const Panel = ({ panelKey, activeKey, children, className = "" }) => {
  const style = {
    display: activeKey !== panelKey ? "none" : null,
    width: "100%",
    height: "100%",
  };
  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
};
