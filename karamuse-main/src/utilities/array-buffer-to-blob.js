export default function arrayBufferToBlob(buffer, type) {
  const uint8Array = new Uint8Array(buffer);
  return new Blob([uint8Array], { type });
}
