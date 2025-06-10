import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";

export default function Button({ onClick, icon, title }) {
  return (
    <button onClick={onClick} className="flex aspect-square w-6 rounded-sm hover:bg-[#ffffff20]" type="button" title={title}>
      <FontAwesomeIcon icon={fas[icon]} className="m-auto text-lg text-[var(--foreground-color)]" />
    </button>
  );
}
