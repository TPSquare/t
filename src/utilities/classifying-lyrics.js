export default function classifyingLyrics(lyricsData) {
  const validData = lyricsData.filter((data) => data.timing);
  if (validData.length === 0) return [];
  const rows = [[validData[0]]];
  for (let k = 1; k < validData.length; k++) {
    const data = validData[k];
    const { start: curStart, end: curEnd } = data;
    let placedPosition = null;
    for (let i = 0; i < rows.length; i++) {
      const overlaps = rows[i].some(
        ({ start, end }) => !(curStart > end || curEnd < start),
      );
      if (!overlaps) {
        placedPosition = i;
        break;
      }
    }
    if (placedPosition === null) {
      placedPosition = rows.length;
      rows.push([]);
    }
    rows[placedPosition].push(data);
  }
  return rows;
}
