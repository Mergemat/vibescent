import type { NoteMeta } from "~/app/_components/types";

export function createNotesIndex(notes: NoteMeta[]): Map<string, NoteMeta> {
  return new Map(notes.map((note) => [note.name, note]));
}
