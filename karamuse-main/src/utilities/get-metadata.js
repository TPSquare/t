import mediaInfoFactory from "@/libraries/mediainfo";

export default async function getMetadata(file) {
  const mediaInfo = await mediaInfoFactory({
    format: "object",
    locateFile: () => "/MediaInfoModule.wasm",
  });
  const getSize = () => file.size;
  const readChunk = async (chunkSize, offset) => {
    const slice = file.slice(offset, offset + chunkSize);
    const buffer = await slice.arrayBuffer();
    return new Uint8Array(buffer);
  };
  const result = await mediaInfo.analyzeData(getSize, readChunk);
  mediaInfo.close();
  const metadata = {};
  for (const data of result.media.track) metadata[data["@type"].toLowerCase()] = data;
  return metadata;
}
