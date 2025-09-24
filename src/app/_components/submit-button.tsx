"use client";
import { Loader2 } from "lucide-react";
import { memo } from "react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export const SubmitButton = memo(function SubmitButtonComponent({
  disabled,
  isUploading,
  isLoading,
}: {
  disabled: boolean;
  isUploading: boolean;
  isLoading: boolean;
}) {
  return (
    <Button
      className={cn(
        "h-11 w-full font-medium text-base transition-all duration-100",
        disabled && "animate-pulse"
      )}
      disabled={disabled}
      size="lg"
      type="submit"
    >
      {isUploading || isLoading ? (
        <>
          <Loader2 className="mr-2 size-4 animate-spin" />
          {isUploading ? "Uploading..." : "Finding notes..."}
        </>
      ) : (
        "Find notes"
      )}
    </Button>
  );
});
