import googleFonts from "@/configs/google-fonts";
import { useState } from "react";

export default function GoogleFontPicker({ onChange, className, fontFamily }) {
  const handleChange = ({ target }) => onChange(target.value);
  return (
    <select className={["rounded-md border-[1.5px] border-[var(--button-background-color)]", className].join(" ")} style={{ fontFamily }} title="Select font" value={fontFamily} onChange={handleChange}>
      {googleFonts.map((font) => (
        <option className="bg-[inherit]" key={font} value={font} style={{ fontFamily: font }}>
          {font}
        </option>
      ))}
    </select>
  );
}
