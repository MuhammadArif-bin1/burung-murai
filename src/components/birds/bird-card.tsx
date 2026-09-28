"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, MapPin } from "lucide-react";
import { useStore } from "@/components/providers/store-provider";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatCurrency } from "@/lib/format";
import type { Bird } from "@/lib/types";

export function BirdCard({ bird }: { bird: Bird }) {
  const { favorites, toggleFavorite, getCategoryById } = useStore();
  const category = getCategoryById(bird.categoryId);
  const favorite = favorites.some((item) => item.birdId === bird.id);

  return (
    <div className="group flex flex-col bg-white border border-stone-200 hover:shadow-xl transition-all duration-300">
      {/* Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
        {bird.images && bird.images.length > 0 ? (
          <Image
            src={bird.images[0]}
            alt={bird.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-stone-100">
            <span className="text-sm text-stone-400 font-body">No Image</span>
          </div>
        )}

        {/* Status badge */}
        <div className="absolute left-3 top-3">
          <StatusBadge kind="bird" status={bird.status} />
        </div>

        {/* Favorite button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(bird.id);
          }}
          className="absolute right-3 top-3 flex size-9 items-center justify-center bg-white/90 text-stone-700 backdrop-blur-sm transition-all hover:bg-white hover:text-rose-500 z-10 cursor-pointer shadow-sm"
          title={favorite ? "Hapus dari favorit" : "Tambah ke favorit"}
        >
          <Heart
            className={`size-4 ${
              favorite ? "fill-rose-500 text-rose-500" : "text-stone-600"
            }`}
          />
        </button>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-4 relative">
        <Link
          href={`/burung/${bird.id}`}
          className="absolute inset-0 focus:outline-none"
          aria-hidden="true"
        >
          <span className="sr-only">Lihat detail</span>
        </Link>

        {category && (
          <span className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-500 relative z-10 font-body">
            {category.name}
          </span>
        )}

        <h3 className="mb-1 text-sm font-bold text-stone-900 group-hover:text-stone-600 transition-colors relative z-10 line-clamp-1 font-heading">
          {bird.name}
        </h3>

        <div className="mb-3 flex items-center text-xs text-stone-500 relative z-10 font-body">
          <MapPin className="mr-1 size-3 text-stone-400" />
          <span>{bird.city}</span>
        </div>

        <div className="mt-auto flex items-end justify-between relative z-10">
          <span className="text-base font-bold text-stone-900 font-body">
            {formatCurrency(bird.price)}
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-stone-500 group-hover:text-stone-900 transition-colors pointer-events-none font-body">
            Detail →
          </span>
        </div>
      </div>
    </div>
  );
}
