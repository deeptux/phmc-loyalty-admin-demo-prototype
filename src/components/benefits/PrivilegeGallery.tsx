"use client";

import type { ReactNode } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import type { PrivilegeBlock } from "@phmc/demo-data";
import { publicAsset } from "@/lib/public-asset";

const ASPECTS = ["aspect-[4/5]", "aspect-[3/4]", "aspect-square"] as const;

type Props = {
  block: PrivilegeBlock;
  index: number;
  selected?: boolean;
  onSelect: () => void;
};

export function PrivilegeGalleryCard({ block, index, selected, onSelect }: Props) {
  const imageUrl = block.infographicImage ? publicAsset(block.infographicImage) : undefined;
  const aspect = ASPECTS[index % ASPECTS.length];

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group w-full break-inside-avoid overflow-hidden rounded-2xl border bg-white text-left shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md ${
        selected
          ? "border-phmc-primary ring-2 ring-phmc-primary/30"
          : "border-phmc-border hover:border-phmc-primary/40"
      }`}
    >
      <div className={`relative w-full overflow-hidden bg-phmc-surface-muted ${aspect}`}>
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt=""
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full min-h-[140px] flex-col items-center justify-center gap-2 text-phmc-text-muted">
            <span className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-dashed border-phmc-border bg-white">
              <PlusIcon className="h-6 w-6 text-phmc-primary" />
            </span>
            <span className="px-2 text-center text-[10px] font-semibold">Add infographic</span>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-3 pt-8">
          <p className="line-clamp-2 text-sm font-bold leading-snug text-white drop-shadow-sm">
            {block.heading || "Untitled block"}
          </p>
        </div>
      </div>
      <div className="border-t border-phmc-border px-3 py-2">
        <p className="line-clamp-2 text-xs text-phmc-text-muted">
          {block.body || "No body copy yet"}
        </p>
      </div>
    </button>
  );
}

type AddProps = {
  onAdd: () => void;
};

export function PrivilegeGalleryAddCard({ onAdd }: AddProps) {
  return (
    <button
      type="button"
      onClick={onAdd}
      className="flex min-h-[200px] w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-phmc-border bg-white/80 text-phmc-text-muted transition-all duration-300 hover:border-phmc-primary/50 hover:bg-phmc-surface-muted hover:text-phmc-primary"
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-phmc-primary/10">
        <PlusIcon className="h-7 w-7 text-phmc-primary" />
      </span>
      <span className="text-xs font-bold uppercase tracking-wide">New infographic</span>
    </button>
  );
}

function GalleryGrid({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`grid grid-cols-2 gap-3 transition-all duration-300 ease-out sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 ${className}`}
    >
      {children}
    </div>
  );
}

type GalleryProps = {
  blocks: PrivilegeBlock[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onAdd: () => void;
  renderEditor: (block: PrivilegeBlock) => ReactNode;
};

export function PrivilegeGallery({
  blocks,
  activeId,
  onSelect,
  onAdd,
  renderEditor,
}: GalleryProps) {
  const activeIndex = activeId ? blocks.findIndex((b) => b.id === activeId) : -1;
  const activeBlock = activeIndex >= 0 ? blocks[activeIndex] : null;

  if (!activeId || !activeBlock) {
    return (
      <GalleryGrid>
        {blocks.map((block, index) => (
          <PrivilegeGalleryCard
            key={block.id}
            block={block}
            index={index}
            onSelect={() => onSelect(block.id)}
          />
        ))}
        <PrivilegeGalleryAddCard onAdd={onAdd} />
      </GalleryGrid>
    );
  }

  const before = blocks.slice(0, activeIndex);
  const after = blocks.slice(activeIndex + 1);

  return (
    <div className="space-y-4">
      {before.length > 0 ? (
        <GalleryGrid>
          {before.map((block, index) => (
            <PrivilegeGalleryCard
              key={block.id}
              block={block}
              index={index}
              onSelect={() => onSelect(block.id)}
            />
          ))}
        </GalleryGrid>
      ) : null}

      <div className="privilege-editor-enter">{renderEditor(activeBlock)}</div>

      <GalleryGrid>
        {after.map((block, index) => (
          <PrivilegeGalleryCard
            key={block.id}
            block={block}
            index={activeIndex + 1 + index}
            onSelect={() => onSelect(block.id)}
          />
        ))}
        <PrivilegeGalleryAddCard onAdd={onAdd} />
      </GalleryGrid>
    </div>
  );
}
