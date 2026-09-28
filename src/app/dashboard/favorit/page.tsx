"use client";

import { BirdCard } from "@/components/bird-card";
import { EmptyState } from "@/components/ui/empty-state";
import { useStore } from "@/components/providers/store-provider";

export default function FavoritePage() {
  const { currentUser, favorites, birds } = useStore();
  const favoriteBirdIds = favorites
    .filter((favorite) => favorite.userId === currentUser?.id)
    .map((favorite) => favorite.birdId);
  const favoriteBirds = birds.filter((bird) => favoriteBirdIds.includes(bird.id));

  return (
    <div className="grid gap-6">
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">
          Favorit
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">Burung favorit</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Simpan kandidat murai pilihan agar mudah dibandingkan sebelum checkout.
        </p>
      </div>
      <div className="mt-6">
        {favoriteBirds.length === 0 ? (
          <EmptyState
            title="Belum ada favorit"
            description="Simpan burung dari katalog untuk melihatnya di sini."
          />
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {favoriteBirds.map((bird) => (
              <BirdCard key={bird.id} bird={bird} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
