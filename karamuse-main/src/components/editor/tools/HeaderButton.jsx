import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";

export default function HeaderButton({ icon, subText, buttonKey, activeKey, setActiveKey }) {
  const isActive = activeKey === buttonKey;

  const handleClick = () => {
    if (!isActive) setActiveKey(buttonKey);
  };

  const color = isActive ? "var(--highlight-color)" : "var(--foreground-color)";
  const hoverColor = isActive ? "var(--highlight-color)" : "white";
  const buttonStyle = { color };
  const iconStyle = { "--hover-color": hoverColor };

  return (
    <button onClick={handleClick} type="button" title={subText} className="group flex h-12 min-w-14 flex-col items-center justify-center" style={buttonStyle}>
      <FontAwesomeIcon icon={fas[icon]} className="text-xl group-hover:text-[var(--hover-color)]" style={iconStyle} />
      <span className="text-sm">{subText}</span>
    </button>
  );
}
