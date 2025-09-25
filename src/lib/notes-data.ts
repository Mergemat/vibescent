"use server";
import { promises as fs } from "node:fs";
import path from "node:path";
import { cache } from "react";
import type { NoteMeta } from "~/app/_components/types";

async function readNotesFromDisk(): Promise<NoteMeta[]> {
  const filePath = path.join(process.cwd(), "fragrantica_notes.json");
  const fileContents = await fs.readFile(filePath, "utf-8");
  return JSON.parse(fileContents) as NoteMeta[];
}

const getCachedNotes = cache(async () => readNotesFromDisk());

export async function getNotesMeta(): Promise<NoteMeta[]> {
  if (process.env.NODE_ENV === "development") {
    return await readNotesFromDisk();
  }

  return getCachedNotes();
}
