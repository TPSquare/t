import convertTailwindToCss from "@/utilities/tailwind-to-css";
import ReactModal from "react-modal";

export default function Modal({ children, className = "", overlayClassName = "", title = "", isOpen, onRequestClose }) {
  const defaultContentClassName = "border-[0.1rem_solid_var(--layout-border-color)]";
  return (
    <ReactModal style={{ overlay: convertTailwindToCss(overlayClassName), content: convertTailwindToCss([defaultContentClassName, className].join(" ")) }} isOpen={isOpen} onRequestClose={onRequestClose}>
      <div className="text-md mb-2 font-medium text-[var(--foreground-color)]">{title}</div>
      {children}
    </ReactModal>
  );
}
