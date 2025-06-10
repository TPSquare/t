const path = require("path");
const { spawnSync } = require("child_process");

const scriptList = ["fonts", "sync-version", "bundle"];
const files = scriptList.map((name) => `${name}.js`);

const scriptsDir = __dirname;
for (const file of files) {
  const filePath = path.join(scriptsDir, file);
  console.log(`▶ Running ${file}...`);
  const result = spawnSync("node", [filePath], { stdio: "inherit" });
  if (result.status !== 0) {
    console.error(`❌ Script ${file} failed.`);
    process.exit(result.status);
  }
}
console.log("✅ All scripts completed.");
