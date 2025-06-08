import fs from "fs";
import path from "path";
import { languages } from "../configs/main.js";
import getDirname from "./get-dirname.js";
const __dirname = getDirname(import.meta.url);
const existingContent = {};
for (const lang of languages) {
  const dir = path.join(__dirname, "../data/texts/" + lang);
  const files = fs.readdirSync(dir);
  existingContent[lang] = [];
  for (const file of files) {
    if (!file.includes(".c.js")) continue;
    const key = file.slice(0, -5);
    existingContent[lang].push(key);
  }
}
const getExistingContent = () => existingContent;
export default getExistingContent;
