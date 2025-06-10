const { bundle } = require("@remotion/bundler");
const path = require("path");
const fs = require("fs");

(async () => {
  const entry = path.join(__dirname, "../src/components/editor/player/RemotionRegister.jsx");
  const bundled = await bundle({
    entryPoint: entry,
    webpackOverride: (config) => config,
  });

  const exportContent = `const serveUrl = "${String(bundled).replaceAll("\\", "/")}";\nexport default serveUrl;`;
  fs.writeFileSync(path.join(__dirname, "../src/configs/serve-url.js"), exportContent);
})();
