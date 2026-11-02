import { useState } from "react";
import { Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageViewer } from "@/components/image-viewer";

export function ProjectScreenshot({
  title,
  images,
  technologies,
  natural = false,
  hint,
}: {
  title: string;
  images: string[];
  technologies: string[];
  /** Show the whole image at its own aspect ratio (no cropping) instead of a 16:10 frame. */
  natural?: boolean;
  /** Optional label shown on the image, e.g. "Click to inspect". */
  hint?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        aria-label={`Enlarge ${title} screenshot`}
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
        className={
          natural
            ? "relative block h-auto w-full overflow-hidden rounded-none bg-muted p-0 hover:bg-muted"
            : "relative block aspect-[16/10] h-auto w-full overflow-hidden rounded-none border-b border-border bg-muted p-0 hover:bg-muted"
        }
      >
        <img
          src={images[0]}
          alt={`${title} workflow screenshot`}
          loading="lazy"
          className={
            natural
              ? "block h-auto w-full"
              : "h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
          }
        />
        {hint ? <span className="lw-shot-hint">{hint}</span> : null}
        <span className="absolute bottom-3 right-3 grid size-8 place-items-center rounded-md border border-border bg-background/90 text-foreground">
          <Maximize2 className="size-4" aria-hidden="true" />
        </span>
      </Button>
      {open ? (
        <ImageViewer
          title={title}
          caption={technologies.join(" · ")}
          images={images}
          onClose={() => setOpen(false)}
        />
      ) : null}
    </>
  );
}
