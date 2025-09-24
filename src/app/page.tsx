"use client";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "convex/react";
import type { ClipboardEvent } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { Form } from "~/components/ui/form";
import { api } from "../../convex/_generated/api";
import notesJson from "../../fragrantica_notes.json" with { type: "json" };
import { HeaderBlock } from "./_components/header-block";
import { LoadingOverlay } from "./_components/loading-overlay";
import { PromptField } from "./_components/prompt-field";
import { ReferenceImageSection } from "./_components/reference-image-section";
import { ResultsSection } from "./_components/results";
import { SubmitButton } from "./_components/submit-button";
import type { NoteMeta } from "./_components/types";

const NOTES_INDEX = new Map<string, NoteMeta>(
  (notesJson as NoteMeta[]).map((n) => [n.name, n])
);

const formSchema = z.object({
  prompt: z.string(),
  image: z.file().optional(),
});

export default function HomePage() {
  const { object, submit, isLoading, error } = useObject({
    api: "/api/generate",
    schema: z.object({
      notes: z.array(z.string()),
    }),
  });

  const [isUploading, setIsUploading] = useState(false);

  const saveImage = useAction(api.requests.saveImage);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      image: undefined,
    },
  });

  const onSubmit = useCallback(
    async (data: z.infer<typeof formSchema>) => {
      if (data.image) {
        setIsUploading(true);
        const uploadedImageUrl = await saveImage({
          image: await data.image.arrayBuffer(),
        });
        setIsUploading(false);
        submit({ prompt: data.prompt, image: uploadedImageUrl ?? "" });
        return;
      }

      submit({ prompt: data.prompt });
    },
    [saveImage, submit]
  );

  // Image preview URL with cleanup
  const image = form.watch("image");
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  useEffect(() => {
    if (!image) {
      setImageUrl(undefined);
      return;
    }
    const file = image as File; // narrow for TS
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [image]);

  // Stable setters for memoized children
  const setPrompt = useCallback(
    (value: string) => form.setValue("prompt", value),
    [form]
  );
  const setImage = useCallback(
    (file: File | undefined) =>
      form.setValue("image", file, {
        shouldValidate: true,
      }),
    [form]
  );

  const handlePaste = useCallback(
    (e: ClipboardEvent<HTMLTextAreaElement>) => {
      e.preventDefault();
      const text = e.clipboardData.getData("text");
      if (text) {
        setPrompt(text);
        return;
      }
      const files = Array.from(e.clipboardData.files ?? []);
      if (files.length) {
        setImage(files[0]);
      }
    },
    [setPrompt, setImage]
  );

  const notes = useMemo<NoteMeta[]>(() => {
    const names = (object?.notes ?? []) as string[];
    const acc: NoteMeta[] = [];
    for (const name of names) {
      const m = NOTES_INDEX.get(name);
      if (m) {
        acc.push(m);
      }
    }
    return acc;
  }, [object]);

  const isBusy = isLoading || isUploading;

  return (
    <main className="relative mx-auto flex min-h-[100svh] w-full max-w-3xl flex-col items-center space-y-6 px-4 py-6 sm:space-y-8 sm:px-6 sm:py-8">
      {isUploading && <LoadingOverlay />}

      <HeaderBlock />

      <Form {...form}>
        <form
          aria-busy={isBusy}
          className="w-full space-y-6"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <PromptField disabled={isBusy} form={form} onPaste={handlePaste} />

          <ReferenceImageSection
            disabled={isBusy}
            imageUrl={imageUrl}
            onSetImage={setImage}
          />

          <SubmitButton
            disabled={isBusy}
            isLoading={isLoading}
            isUploading={isUploading}
          />
        </form>
      </Form>

      <ResultsSection error={error} isLoading={isLoading} notes={notes} />
    </main>
  );
}
