"use client";
import type { ClipboardEvent } from "react";
import { memo } from "react";
import type { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Textarea } from "~/components/ui/textarea";
import type { GenerateFormValues } from "./types";

export const PromptField = memo(function PromptFieldComponent({
  form,
  disabled,
  onPaste,
}: {
  form: UseFormReturn<GenerateFormValues>;
  disabled: boolean;
  onPaste: (e: ClipboardEvent<HTMLTextAreaElement>) => void;
}) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="prompt"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-medium text-base">
              Scent Description
            </FormLabel>
            <FormControl>
              <Textarea
                className="min-h-[100px] resize-none"
                disabled={disabled}
                placeholder="Describe the vibe of your scent"
                {...field}
                onPaste={onPaste}
              />
            </FormControl>
            <FormDescription className="text-sm">
              Tip: paste text or an image directly into the text area.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
});
