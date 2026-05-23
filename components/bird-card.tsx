"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, MapPin } from "lucide-react";
import { useStore } from "@/components/providers/store-provider";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatCurrency } from "@/lib/format";
import type { Bird } from "@/lib/types";

export function BirdCard({ bird }: { bird: Bird }) {
  const { currentUser, favorites, toggleFavorite, getCategoryById } = useStore();
  const category = getCategoryById(bird.categoryId);
  const favorite = favorites.some(
    (item) => item.userId === currentUser?.id && item.birdId === bird.id,
  );

  return (
    <article className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={bird.images[0]}
          alt={bird.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute left-3 top-3">
          <StatusBadge kind="bird" status={bird.status} />
        </div>
        {currentUser?.role === "USER" && (
          <button
            type="button"
            onClick={() => toggleFavorite(bird.id)}
            className="absolute right-3 top-3 inline-flex size-9 items-center justify-center rounded-full bg-white/95 text-slate-700 shadow-sm"
            aria-label={favorite ? "Hapus dari favorit" : "Tambah ke favorit"}
          >
            <Heart
              className={`size-4 ${favorite ? "fill-rose-500 text-rose-500" : ""}`}
            />
          </button>
        )}
      </div>
      <div className="space-y-3 p-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-emerald-700">
            {category?.name}
          </p>
          <h3 className="mt-1 text-lg font-semibold text-slate-950">{bird.name}</h3>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <MapPin className="size-4" />
          {bird.city}
        </div>
        <div className="flex items-end justify-between gap-3">
          <p className="text-lg font-bold text-emerald-950">
            {formatCurrency(bird.price)}
          </p>
          <Link
            href={`/burung/${bird.id}`}
            className="rounded-md bg-emerald-900 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-800"
          >
            Lihat detail
          </Link>
        </div>
      </div>
    </article>
  );
}
