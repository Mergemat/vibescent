import { Loader2 } from "lucide-react";

export function LoadingOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-background/60 backdrop-blur">
      <Loader2 className="h-6 w-6 animate-spin" />
    </div>
  );
}
