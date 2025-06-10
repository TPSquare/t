import Replicate from "replicate";
const replicate = new Replicate();

const identifier =
  "soykertje/spleeter:cd128044253523c86abfd743dea680c88559ad975ccd72378c8433f067ab5d0a";

export const POST = async (request) => {
  const buffer = Buffer.from(await request.arrayBuffer());
  const input = { audio: buffer };
  try {
    const output = await replicate.run(identifier, { input });
    return new Response(output, { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Error!" }, { status: 500 });
  }
};
