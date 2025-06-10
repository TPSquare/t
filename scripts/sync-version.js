const fs = require("fs");
const path = require("path");
const pkg = require("../package.json");

fs.writeFileSync(
  path.join(__dirname, "../src/configs/version.js"),
  `const version = "${pkg.version}";\nexport default version;`,
  { encoding: "utf-8" },
);
