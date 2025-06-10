import { HexColorInput, HexColorPicker as ReactHexColorPicker } from "react-colorful";
import { createContext, useState } from "react";

import Modal from "../Modal";
import basicColors from "@/configs/basic-colors";
import "@/styles/hex-color-picker.css";

const BasicColors = ({ onChange: handleChange }) => {
  const buttons = Object.entries(basicColors).map(([name, hex]) => <button className="h-10 w-16 rounded-md border-1 border-[grey]" onClick={() => handleChange(hex)} style={{ backgroundColor: hex }} key={name} type="button" title={[name, hex].join(" ")}></button>);
  return <div className="flex h-60 w-54 flex-wrap space-y-2 space-x-2">{buttons}</div>;
};

const PickerContext = createContext();
export default function HexColorPicker({ color, onChange: customSetColor, className }) {
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleChangeColor = (color) => customSetColor(color);

  return (
    <PickerContext.Provider value={{}}>
      <button className={className} style={{ backgroundColor: color }} onClick={openModal} type="button" title="Pick color"></button>
      <Modal className="inset-none static z-1000 m-auto rounded-[8px] bg-[var(--layout-background-color)] p-4 pt-2" overlayClassName="bg-[#000000aa] z-999 flex" title="Pick color" isOpen={isOpen} onRequestClose={closeModal}>
        <div className="flex space-x-2">
          <BasicColors onChange={handleChangeColor} />
          <div className="space-y-2">
            <ReactHexColorPicker className="custom-hex-color-picker" color={color} onChange={handleChangeColor} />
            <div className="flex items-center justify-between">
              <div className="h-7 w-12 rounded-md border-[1.5px] border-[var(--layout-border-color)]" style={{ backgroundColor: color }}></div>
              <HexColorInput className="w-37 rounded-md border-[1.5px] border-[var(--layout-border-color)] bg-[var(--input-background-color)] px-2 pt-0.5 pb-1 text-sm font-medium text-[var(--foreground-color)] focus:outline-none" color={color} onChange={handleChangeColor} />
            </div>
          </div>
        </div>
      </Modal>
    </PickerContext.Provider>
  );
}
