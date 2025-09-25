import { getNotesMeta } from "~/lib/notes-data";

export async function GET() {
  const notes = await getNotesMeta();
  return Response.json(notes);
}
