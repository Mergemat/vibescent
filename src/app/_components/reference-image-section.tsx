"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { memo, useCallback } from "react";
import type { UseFormReturn } from "react-hook-form";
import { Button } from "~/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { cn } from "~/lib/utils";
import { FileDropzone } from "./file-input";
import type { GenerateFormValues } from "./types";

export const ReferenceImageSection = memo(
  function ReferenceImageSectionComponent({
    form,
    imageUrl,
    disabled,
    onSetImage,
  }: {
    form: UseFormReturn<GenerateFormValues>;
    imageUrl?: string;
    disabled: boolean;
    onSetImage: (file: File | undefined) => void;
  }) {
    const handleDropFiles = useCallback(
      (file: File) => onSetImage(file),
      [onSetImage]
    );
    const handleDelete = useCallback(() => onSetImage(undefined), [onSetImage]);

    return (
      <div className="space-y-3">
        <div>
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium text-base">
                  Reference Image{" "}
                  <span className="font-normal text-muted-foreground">
                    (Optional)
                  </span>
                </FormLabel>
                <FormControl>
                  <FileDropzone
                    disabled={disabled}
                    onDropFiles={handleDropFiles}
                  />
                </FormControl>
                <FormDescription className="text-sm">
                  Drop a moodboard or a meme. Idc really.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <SelectedImage
          image={imageUrl}
          isDisabled={disabled}
          onDeleteAction={handleDelete}
        />
      </div>
    );
  }
);

export function SelectedImage({
  image,
  onDeleteAction,
  isDisabled,
}: {
  image?: string;
  onDeleteAction: () => void;
  isDisabled: boolean;
}) {
  if (!image) {
    return null;
  }
  return (
    <div
      className={cn(
        "group relative h-48 w-full sm:h-60",
        isDisabled && "opacity-50"
      )}
    >
      <div className="absolute inset-0 z-20 rounded-md bg-background/0 duration-100 group-hover:bg-background/50" />
      <Button
        aria-label="Remove image"
        className="absolute top-2 right-2 z-20 h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100 sm:top-1 sm:right-1 sm:h-6 sm:w-6"
        disabled={isDisabled}
        onClick={onDeleteAction}
        size="icon"
        type="button"
        variant="ghost"
      >
        <X className="h-3 w-3 sm:h-4 sm:w-4" />
      </Button>
      <div className="relative h-48 w-full sm:h-60">
        <Image
          alt="Reference"
          className="h-48 w-full rounded-md border border-primary/20 object-cover sm:h-60"
          fill
          src={image}
          style={{ objectFit: "contain" }}
        />
      </div>
    </div>
  );
}
