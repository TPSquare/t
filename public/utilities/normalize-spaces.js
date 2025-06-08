export default function normalizeSpaces(str) {
  const lines = str.split("\n");
  const replacedLines = lines.map((e) => e.trim().split(/\s+/).join(" "));
  const resultLines = replacedLines.filter((e) => e.length != 0);
  return resultLines.join("\n");
}
