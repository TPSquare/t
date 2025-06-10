import NumberInput from "@/components/NumberInput";

export default function InputNumberWidthLabel({ label = "", className = "", value, onChange }) {
  return (
    <div className="flex h-6 items-center space-x-1">
      <div className="overflow-hidden whitespace-nowrap">{label}:</div>
      <NumberInput title={label} min={0} value={value} height={26} className={["flex-1 px-2", className].join(" ")} onChange={onChange} />
    </div>
  );
}
