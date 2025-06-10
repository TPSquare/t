const absoluteMap = {
  flex: { display: "flex" },
  static: { position: "static" },
  "rounded-lg": { borderRadius: "0.5rem" },
  "m-auto": { margin: "auto" },
};
const predefinedKey = {
  m: "margin:spacing",
  inset: "inset:spacing",
  z: "zIndex",
  px: "paddingInline:spacing",
  py: "paddingBlock:spacing",
  pt: "paddingTop:spacing",
  p: "padding:spacing",
  bg: "backgroundColor",
};
const arbitraryKey = {
  bg: "backgroundColor",
  text: "color",
  border: (value) => (value.split(" ").length === 1 ? "borderColor" : "border"),
  rounded: "borderRadius",
};

const convert = (cls) => {
  if (absoluteMap[cls]) return absoluteMap[cls];

  if (cls.includes("[")) {
    const match = cls.match(/^([a-z-]+)-\[(.+)\]$/i);
    if (match) {
      const [_, key, v] = match;
      const value = v.replaceAll("_", " ");
      const define = arbitraryKey[key];
      if (define) {
        if (typeof define === "string") return { [define]: value };
        return { [define(value)]: value };
      }
    }
  } else {
    const match = cls.match(/^([a-z]+)-(.+)$/i);
    if (match) {
      const [_, key, value] = match;
      const define = predefinedKey[key];
      if (define) {
        if (!define.includes(":")) return { [define]: value };
        const [property, transform] = define.split(":");
        if (value.includes("var") || value.includes("calc")) return { [property]: value };
        switch (transform) {
          case "spacing":
            return { [property]: `calc(var(--spacing) * ${value})` };
        }
      }
    }
  }
  console.warn(`\`${cls}\` is not defined in any known map!`);
  return {};
};

export default function convertTailwindToCss(classes) {
  return classes.split(" ").reduce((acc, cls) => {
    Object.assign(acc, convert(cls));
    return acc;
  }, {});
}
