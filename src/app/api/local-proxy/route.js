import fs from "fs/promises";
import path from "path";

export async function GET(request) {
  const filePath = decodeURIComponent(new URL(request.url).searchParams.get("path"));

  try {
    const file = await fs.readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();

    const contentType = (() => {
      switch (ext) {
        case ".mp4":
          return "video/mp4";
        case ".mp3":
          return "audio/mpeg";
        default:
          return "application/octet-stream";
      }
    })();

    return new Response(file, {
      status: 200,
      headers: {
        "Content-Type": contentType,
      },
    });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
