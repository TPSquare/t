import HexColorPicker from "@/components/color-pickers/hex";

export default function ColorPickerWithLabel({ label = "", color, onChange }) {
  return (
    <div className="flex h-6 items-center space-x-1">
      <div className="overflow-hidden whitespace-nowrap">{label}:</div>
      <HexColorPicker className="h-full w-10 rounded-md border-[1.5px] border-[var(--button-background-color)]" color={color} onChange={onChange} />
    </div>
  );
}
