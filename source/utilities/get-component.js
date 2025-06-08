import ejs from "ejs";
import path from "path";
import getDirname from "./get-dirname.js";
const __dirname = getDirname(import.meta.url);
export default function getComponent(component, data) {
  return new Promise((resolve, reject) => {
    const callback = (err, str) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        const result = str
          .split("\n")
          .map((e) => e.trim())
          .join("");
        resolve(result);
      }
    };
    ejs.renderFile(
      path.join(__dirname, `../components/${component}.ejs`),
      data,
      callback,
    );
  });
}
