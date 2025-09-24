"use client";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import { cn } from "~/lib/utils";
import type { NoteMeta } from "./types";

export const ResultsSection = memo(function ResultsSectionComponent({
  notes,
  isLoading,
  error,
}: {
  notes: NoteMeta[];
  isLoading: boolean;
  error: unknown;
}) {
  const hasError = Boolean(error);
  return (
    <section
      className={cn(
        "w-full rounded-lg border border-border bg-card p-4 shadow-sm sm:p-6",
        isLoading && "animate-pulse"
      )}
    >
      {hasError && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-center">
          <p className="text-destructive text-sm">
            Failed to find notes. Please try again with a different description
            or image.
          </p>
        </div>
      )}

      {isLoading && notes.length === 0 && !hasError && (
        <div className="flex h-32 w-full items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground text-sm">
              Analyzing your request...
            </p>
          </div>
        </div>
      )}

      {!isLoading && notes.length === 0 && !hasError && (
        <div className="py-8 text-center">
          <p className="text-muted-foreground">Result will appear here.</p>
        </div>
      )}

      {notes.length > 0 && (
        <div>
          <div className="mb-4">
            <h2 className="font-semibold text-foreground text-lg">
              Scent Notes
            </h2>
            <p className="text-muted-foreground text-sm">
              Click on any note to explore on Fragrantica
            </p>
          </div>
          <NotesGrid notes={notes} />
        </div>
      )}
    </section>
  );
});

const NotesGrid = memo(function NotesGridComponent({
  notes,
}: {
  notes: NoteMeta[];
}) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {notes.map((note, index) => (
        <NoteCard index={index} key={note.name} note={note} />
      ))}
    </div>
  );
});

const NoteCard = memo(function NoteCardComponent({
  note,
  index,
}: {
  note: NoteMeta;
  index: number;
}) {
  return (
    <Link
      className="group flex w-full flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-all duration-100 hover:scale-105 hover:shadow-lg"
      href={note.link}
      rel="noopener noreferrer"
      style={{ animationDelay: `${index * 100}ms` }}
      target="_blank"
    >
      <Image
        alt={note.name ?? ""}
        className="h-20 w-full object-cover"
        height={40}
        src={note.image_url || "https://placehold.co/200x200"}
        width={40}
      />
      <div className="p-3">
        <h3 className="line-clamp-2 font-medium text-foreground text-sm">
          {note.name}
        </h3>
        <p className="mt-1 text-muted-foreground text-xs">Fragrantica</p>
      </div>
    </Link>
  );
});
