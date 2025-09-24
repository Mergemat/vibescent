import { UploadCloud } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { cn } from "~/lib/utils";

type FileDropzoneProps = {
  onDropFiles: (files: File) => void;
  disabled?: boolean;
};

export function FileDropzone({ onDropFiles, disabled }: FileDropzoneProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    multiple: false,
    disabled,

    onDrop: (acceptedFiles) => {
      if (acceptedFiles[0]) {
        onDropFiles(acceptedFiles[0]);
      }
    },
  });

  let stateClass = "";
  if (disabled) {
    stateClass = "cursor-not-allowed opacity-50";
  } else if (isDragActive) {
    stateClass = "border-primary bg-primary/10";
  } else {
    stateClass = "border-muted-foreground/30 hover:border-primary";
  }

  return (
    <div
      {...getRootProps()}
      aria-disabled={disabled}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed p-6 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        stateClass
      )}
    >
      <input {...getInputProps()} />
      <UploadCloud
        aria-hidden="true"
        className="mb-2 h-5 w-5 text-muted-foreground"
      />
      <p className="font-medium">Drop an image here</p>
      <p className="text-muted-foreground text-xs">or click to browse</p>
    </div>
  );
}
