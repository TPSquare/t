export default function replaceWithMap(str, map) {
  let result = str;
  Object.entries(map).forEach(([key, value]) => (result = result.replaceAll(key, value)));
  return result;
}
