const googleFonts = require("../src/configs/google-fonts").default;
const path = require("path");
const fs = require("fs");

const fontNames = googleFonts.map((f) => f.replaceAll(" ", "+"));
const urls = fontNames.map((f) => `https://fonts.googleapis.com/css2?family=${f}&display=swap`);
const imports = urls.map((url) => `@import url("${url}");`);
fs.writeFileSync(path.join(__dirname, "../src/styles/fonts.css"), imports.join("\n"));
