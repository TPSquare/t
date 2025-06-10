export default function CheckBoxWithLabel({ name, label = "", onChange, checked }) {
  const handleChange = ({ target }) => onChange?.(target.checked);
  return (
    <div className="flex h-6 items-center space-x-1">
      <input className="custom-checkbox" type="checkbox" name={name} onChange={handleChange} checked={checked} />
      <label className="pb-[0.125rem]">{label}</label>
    </div>
  );
}
