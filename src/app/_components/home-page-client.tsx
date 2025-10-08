"use client";

import { experimental_useObject as useObject } from "@ai-sdk/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "convex/react";
import type { ClipboardEvent } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { Form } from "~/components/ui/form";
import { api } from "../../../convex/_generated/api";
import { HeaderBlock } from "./header-block";
import { LoadingOverlay } from "./loading-overlay";
import { PromptField } from "./prompt-field";
import { ReferenceImageSection } from "./reference-image-section";
import { ResultsSection } from "./results";
import { SubmitButton } from "./submit-button";
import type { NoteMeta } from "./types";

const formSchema = z.object({
  prompt: z.string(),
  image: z.file().max(5_000_000, "Image size must be less than 5MB").optional(),
});

const createNotesIndex = (list: NoteMeta[]): Map<string, NoteMeta> =>
  new Map(list.map((note) => [note.name, note]));

export function HomePageClient({ notes }: { notes: NoteMeta[] }) {
  const notesIndexRef = useRef(createNotesIndex(notes));

  useEffect(() => {
    notesIndexRef.current = createNotesIndex(notes);
  }, [notes]);

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

  const uploadImageAndSubmit = useCallback(
    async ({ file, promptValue }: { file: File; promptValue: string }) => {
      setIsUploading(true);
      form.clearErrors("image");

      try {
        const arrayBuffer = await file.arrayBuffer();
        const uploadedImageUrl = await saveImage({ image: arrayBuffer });
        submit({ prompt: promptValue, image: uploadedImageUrl ?? "" });
      } catch (uploadError) {
        const message =
          uploadError instanceof Error
            ? uploadError.message
            : "Failed to upload image.";
        form.setError("image", { type: "manual", message });
      } finally {
        setIsUploading(false);
      }
    },
    [form, saveImage, submit]
  );

  const onSubmit = useCallback(
    async (data: z.infer<typeof formSchema>) => {
      if (isUploading) {
        return;
      }

      const trimmedPrompt = data.prompt.trim();
      const image = data.image;

      if (!(trimmedPrompt || image)) {
        form.setError("prompt", {
          type: "manual",
          message: "Enter a prompt or upload an image before submitting.",
        });
        return;
      }

      form.clearErrors("prompt");

      if (image) {
        await uploadImageAndSubmit({ file: image, promptValue: trimmedPrompt });
        return;
      }

      submit({ prompt: trimmedPrompt });
    },
    [form, isUploading, submit, uploadImageAndSubmit]
  );

  const selectedImage = form.watch("image");
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!selectedImage) {
      setImageUrl(undefined);
      return;
    }

    const file = selectedImage as File;
    const url = URL.createObjectURL(file);
    setImageUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [selectedImage]);

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
    (event: ClipboardEvent<HTMLTextAreaElement>) => {
      event.preventDefault();
      const text = event.clipboardData.getData("text");
      if (text) {
        setPrompt(text);
        return;
      }

      const files = Array.from(event.clipboardData.files ?? []);
      if (files.length) {
        setImage(files[0]);
      }
    },
    [setPrompt, setImage]
  );

  const notesForResult = useMemo<NoteMeta[]>(() => {
    const names = Array.isArray(object?.notes)
      ? ((object?.notes ?? []) as string[])
      : [];
    const acc: NoteMeta[] = [];
    const index = notesIndexRef.current;

    for (const name of names) {
      const noteMeta = index.get(name);
      if (noteMeta) {
        acc.push(noteMeta);
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
            form={form}
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

      <ResultsSection
        error={error}
        isLoading={isLoading}
        notes={notesForResult}
      />
    </main>
  );
}
