import { readFileSync } from "node:fs";
import path from "node:path";

export function GET() {
  const filePath = path.join(process.cwd(), "fragrantica_notes.json");
  const fileContents = readFileSync(filePath, "utf-8");
  const notes = JSON.parse(fileContents);

  // Optional: filter, paginate, or slice big data here
  return Response.json(notes);
}
