export const runtime = "nodejs";

import { getCompositions, renderMedia } from "@remotion/renderer";
import path from "path";
import os from "os";
import fs from "fs/promises";
import { randomUUID } from "crypto";

import serveUrl from "@/configs/serve-url";
import getProxyUrl from "@/utilities/get-proxy-url";

export const POST = async (request) => {
  const searchParams = new URL(request.url).searchParams;
  const width = parseInt(searchParams.get("width"), 10);
  const height = parseInt(searchParams.get("height"), 10);
  const fps = parseInt(searchParams.get("fps"), 10);
  const durationInFrames = parseInt(searchParams.get("durationInFrames"), 10);
  const inputProps = await request.json();

  const tmpFolder = path.join(os.tmpdir(), `karamuse-${randomUUID()}`);
  await fs.mkdir(tmpFolder);
  const outputFile = path.join(tmpFolder, "output.mp4");

  if (inputProps.audio) {
    const audioPath = path.join(tmpFolder, "input-audio.mp3");
    await fs.writeFile(audioPath, new Uint8Array(inputProps.audio.buffer));
    delete inputProps.audio.buffer;
    inputProps.audio.url = getProxyUrl(audioPath);
  }
  if (inputProps.video) {
    const videoPath = path.join(tmpFolder, "input-video.mp4");
    await fs.writeFile(videoPath, new Uint8Array(inputProps.video.buffer));
    delete inputProps.video.buffer;
    inputProps.video.url = getProxyUrl(videoPath);
  }

  let lastProgress = -1;
  try {
    const compositions = await getCompositions(serveUrl, { inputProps });
    const composition = compositions.find((c) => c.id === "Video");

    await renderMedia({
      composition: {
        ...composition,
        width,
        height,
        fps,
        durationInFrames,
      },
      serveUrl,
      codec: "h264",
      outputLocation: outputFile,
      inputProps,
      onProgress: ({ progress }) => {
        const nextProgress = Math.floor(progress * 100);
        if (nextProgress !== lastProgress) {
          console.log(`${nextProgress}%`);
          lastProgress = nextProgress;
        }
      },
      onBrowserLog: (log) => console.log(log.text),
    });

    const fileBuffer = await fs.readFile(outputFile);
    await fs.rm(tmpFolder, { recursive: true, force: true });

    return new Response(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "video/mp4",
        "Content-Disposition": "attachment; filename=video.mp4",
      },
    });
  } catch (err) {
    console.error("Render error:", err);
    return Response.json({ error: "Error!" }, { status: 500 });
  }
};
