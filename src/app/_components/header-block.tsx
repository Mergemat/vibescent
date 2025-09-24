export function HeaderBlock() {
  return (
    <header className="w-full space-y-3 text-center sm:space-y-4">
      <div className="flex items-center justify-center gap-2 sm:gap-3">
        <h1 className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text font-bold text-2xl text-transparent tracking-tight sm:text-4xl">
          Vibescent
        </h1>
      </div>
      <p className="mx-auto max-w-md text-muted-foreground text-sm leading-relaxed sm:text-base">
        Discover the perfect perfume notes by describing your desired vibe or
        uploading a reference image.
      </p>
    </header>
  );
}
