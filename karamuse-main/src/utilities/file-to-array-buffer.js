export default function fileToArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(Array.from(new Uint8Array(reader.result)));
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}
