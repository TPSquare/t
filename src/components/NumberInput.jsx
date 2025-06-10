import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef } from "react";

export default function NumberInput({ title, min, value, className, height, onChange }) {
  const inputRef = useRef();

  const handleChange = ({ target }) => onChange(target.value);
  const increment = () => {
    inputRef.current.stepUp();
    handleChange({ target: inputRef.current });
  };
  const decrement = () => {
    inputRef.current.stepDown();
    handleChange({ target: inputRef.current });
  };
  return (
    <div className={["relative flex items-center overflow-hidden", className].join(" ")} style={{ height: `${height}px` }}>
      <input ref={inputRef} className="spin-button-hidden h-full w-full pr-4" type="number" title={title} min={min} value={value} onChange={handleChange} autoComplete="off" />
      <div className="absolute top-0 right-0 h-full bg-[var(--native-ui-background-color)] px-[0.2em] text-[var(--native-ui-foreground-color)]">
        <button className="flex items-center hover:text-[var(--foreground-color)]" style={{ height: `${height / 2}px` }} onClick={increment} type="button" title="Increment">
          <FontAwesomeIcon style={{ height: `${height / 2}px` }} icon={fas.faCaretUp} />
        </button>
        <button className="flex items-center pb-[0.3em] hover:text-[var(--foreground-color)]" style={{ height: `${height / 2}px` }} onClick={decrement} type="button" title="Decrement">
          <FontAwesomeIcon style={{ height: `${height / 2}px` }} icon={fas.faCaretDown} />
        </button>
      </div>
    </div>
  );
}
